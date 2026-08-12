// Meta Pixel helpers. Every function is a safe no-op when the pixel is not
// configured or fbevents.js has not loaded.

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

/** Pixel ids are numeric. Reject anything else before it reaches an inline script. */
export function isValidPixelId(id: string): boolean {
  return /^\d{6,20}$/.test(id);
}

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/**
 * The ONE place window.fbq is ever invoked. Every helper below goes through
 * it, so a caller cannot accidentally reintroduce an unprotected call site.
 *
 * A throwing fbq is not hypothetical. Some privacy extensions REPLACE
 * window.fbq with a stub that throws instead of blocking
 * connect.facebook.net, and the pixel snippet's own `if (f.fbq) return;`
 * guard means fbevents.js then never loads to correct it.
 *
 * Unprotected, that exception escaped into whatever called the helper. The
 * worst path was FacebookPixel's route effect: a throw inside a commit-phase
 * useEffect reaches React's error boundary, which unmounts the tree and
 * replaces the entire page with the global error screen. A landing page whose
 * traffic is bought from ad platforms is exactly the audience most likely to
 * run such an extension, so a blocked pixel was taking the page down for the
 * visitors it most needed to reach.
 *
 * A blocked or hostile pixel must cost the pixel event, and nothing else.
 *
 * Returns whether fbq was actually reached, so a caller that polls (see
 * trackWhenReady) can tell "not loaded yet" from "loaded, and it threw" - the
 * second must end the poll rather than retry a sink that will throw again.
 */
function callFbq(...args: unknown[]): boolean {
  if (typeof window === "undefined" || !window.fbq) return false;
  try {
    window.fbq(...args);
  } catch {
    // Analytics must never break the page.
  }
  return true;
}

export function pageview(): void {
  callFbq("track", "PageView");
}

export function track(name: string, data?: Record<string, unknown>): void {
  callFbq("track", name, data ?? {});
}

export function trackCustom(name: string, data?: Record<string, unknown>): void {
  callFbq("trackCustom", name, data ?? {});
}

/**
 * fbevents.js loads async; events fired right after mount (or on pages reached
 * via a full-page redirect) are silently dropped by plain track(). Poll until
 * fbq exists, then fire. eventID enables Conversions-API dedup.
 */
export function trackWhenReady(
  name: string,
  data?: Record<string, unknown>,
  eventID?: string,
  attempts = 30
): void {
  if (typeof window === "undefined" || !FB_PIXEL_ID) return;
  const attempt = (left: number) => {
    // callFbq reports whether fbq was REACHED, not whether it succeeded. A stub
    // that throws is still an answer, so stop here: retrying it would just
    // throw 30 more times, and the retry runs inside a timer where an escaping
    // exception has no caller left to catch it.
    const reached = eventID
      ? callFbq("track", name, data ?? {}, { eventID })
      : callFbq("track", name, data ?? {});
    if (reached) return;
    if (left <= 0) return;
    window.setTimeout(() => attempt(left - 1), 150);
  };
  attempt(attempts);
}

/** Route → custom event fired on every visit to that route. /admin is excluded on purpose. */
export const ROUTE_EVENT_MAP: Record<string, string> = {
  "/": "Landing",
  "/privacy": "PrivacyPolicy",
  "/terms": "TermsOfService",
  "/ai-data-disclosure": "AiDataDisclosure",
  "/professional-disclaimer": "ProfessionalDisclaimer",
  "/faq": "Faq",
  "/glossary": "Glossary",
  "/accessibility": "Accessibility",
};

/** Normalize before lookup, un-normalized paths ("/privacy/") silently miss. */
export function routeEventName(pathname: string): string | undefined {
  let path = pathname.trim();
  if (path.length > 1 && path.endsWith("/")) path = path.replace(/\/+$/, "");
  if (path === "") path = "/";
  return ROUTE_EVENT_MAP[path];
}
