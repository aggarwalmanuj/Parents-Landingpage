// Client instrumentation (Next 15.3+ convention): runs before the app
// becomes interactive.

import { captureFirstTouchAttribution } from "@/lib/attribution";
import { getConsent, onConsentChange } from "@/lib/consent";
import { setPostHogClient } from "@/lib/posthog-client";

// Attribution is captured unconditionally, it must work even when PostHog
// is off. (captureFirstTouchAttribution is idempotent and try/catch'd.)
//
// It also stays SYNCHRONOUS and free of any posthog-js import, which is what
// lets it run in the first tick of client instrumentation: `fbclid` and the
// UTM set have to be read off window.location before anything can strip or
// rewrite the URL, and they must be captured for visitors who never grant
// consent at all.
captureFirstTouchAttribution();

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const enableDev = process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV === "true";

/**
 * Load and initialise posthog-js.
 *
 * The import is dynamic so the library is fetched only for visitors who have
 * actually granted consent, instead of riding in the initial bundle of every
 * first-time ad click that has not answered the banner yet. See
 * lib/posthog-client.ts for the full reasoning.
 *
 * Events emitted before this resolves are not lost: lib/analytics.ts buffers
 * them and replays them the moment setPostHogClient() lands.
 */
async function startPostHog(): Promise<void> {
  if (
    !token ||
    typeof window === "undefined" ||
    // Dev clicks pollute prod funnels; offline dev machines spam "Failed to fetch".
    (process.env.NODE_ENV !== "production" && !enableDev)
  ) {
    return;
  }

  let posthog;
  try {
    posthog = (await import("posthog-js")).default;
  } catch {
    // Chunk blocked or offline. The page must not break, and the buffered
    // events simply stay unsent — exactly as they would if the library were
    // blocked by an extension.
    return;
  }

  posthog.init(token, {
    // Own-origin reverse proxy (next.config rewrites), defeats ad blockers
    // that drop *.posthog.com by hostname.
    api_host: "/ingest",
    // Dashboard host for toolbar/"Open in PostHog" links only, never the proxy.
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
    defaults: "2026-01-30",
    // The dated defaults use history_change, which can miss the very first
    // page load in some Next.js boot orderings, keep explicit pageviews on.
    capture_pageview: true,
    persistence: "localStorage+cookie",
    debug: process.env.NODE_ENV !== "production",
    session_recording: { maskAllInputs: true },
    loaded: (ph) => {
      // A stale opt-out flag in localStorage silently blocks ALL captures
      // forever; opting back in makes capture self-healing.
      try {
        if (ph.has_opted_out_capturing()) {
          ph.opt_in_capturing();
        }
      } catch {
        // ignore
      }
    },
  });

  // Publish only after init(): every consumer checks `__loaded`, and handing
  // out a client that has not been initialised would make that check pass on
  // an instance that cannot capture.
  setPostHogClient(posthog);
}

// GDPR: PostHog sets cookies/localStorage, so it only starts after explicit
// consent, immediately for returning visitors who already accepted, or the
// moment the banner's Accept is pressed.
if (typeof window !== "undefined") {
  if (getConsent() === "granted") {
    void startPostHog();
  } else {
    onConsentChange((value) => {
      if (value === "granted") void startPostHog();
    });
  }
}
