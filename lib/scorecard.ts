// Builds the outbound link that hands a visitor off to the AI Merge "Parenting
// Belief Score" scorecard, carrying our stored acquisition data as URL query
// params. The scorecard reads these on page load. No API call, no other
// integration. Our only job is to build the URL correctly.

import { getStoredFirstTouch } from "./attribution";

/** The Parenting Belief Score entry point for this funnel (the Parents
 *  doorway). Shares the audience link with the other AI Merge doorways; the
 *  `lp` + UTM params below are what keep this funnel's attribution distinct.
 *  TODO(launch): replace with the approved live Parents assessment URL once it
 *  exists (spec: "ASSESSMENT URL — INSERT APPROVED LIVE URL"). */
export const SCORECARD_BASE_URL =
  // Overridable so LOCAL testing of this page hands off to a LOCAL funnel.
  // Without this the CTA always pointed at production, so every dev click
  // created a real lead row in the live database. Unset in production, where
  // the default below is correct.
  process.env.NEXT_PUBLIC_SCORECARD_BASE_URL ??
  "https://www.aimerge.live/challenge/audience";

/** Short slug identifying THIS landing page / funnel. */
export const LP_SLUG = "parents";

/**
 * The campaign this doorway belongs to, per the spec's CAMPAIGN CONTINUITY
 * block. Real ad clicks override it with their own utm_campaign; this is the
 * organic/direct default.
 */
export const CAMPAIGN_ID = "PARENT_BELIEF_SCORE_COLD_CA";

/**
 * Channel defaults for organic / direct visitors who carry no stored ad
 * attribution. Real first-touch values (from an actual ad click) override these
 * per-param below, and `lp` always marks the doorway regardless of source.
 */
const DEFAULT_UTMS: Record<string, string> = {
  utm_source: "parents",
  utm_medium: "organic",
  utm_campaign: CAMPAIGN_ID,
};

const REF_STORAGE_KEY = "aimerge-ref";

function newRef(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `${LP_SLUG}_${crypto.randomUUID()}`;
    }
  } catch {
    // fall through to the best-effort fallback
  }
  return `${LP_SLUG}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Stable, first-party visitor id used as `ref`: the JOIN key the scorecard
 * echoes back so a completed score reconciles 1:1 to this visitor. Generated
 * once and persisted; first touch wins, so the first click that lands is the id
 * that sticks (and every later click resends the same one).
 */
export function getOrCreateVisitorRef(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(REF_STORAGE_KEY);
    if (existing) return existing;
    const id = newRef();
    window.localStorage.setItem(REF_STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage unavailable (private mode): still send a ref for this click
    // so attribution flows, even though it can't persist across visits.
    return newRef();
  }
}

/** Read a single cookie value (browser only). Undefined if absent. */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * The URL to hand off with BEFORE React hydrates.
 *
 * The page is statically prerendered, so the CDN serves its markup to everyone
 * and the hero CTA is clickable before any JS runs (see the hero's
 * paint-without-JS work). Anything that reaches the funnel from that first
 * paint therefore has to be carried by the server-rendered href itself.
 *
 * `lp` is the only param that can be: it is a constant for this doorway, so
 * emitting it is deterministic and cannot mismatch on hydration. That matters
 * because the scorecard keys its parent branding off `lp=parents` - without it
 * a fast clicker lands on the generic flow.
 *
 * The UTMs deliberately stay behind: their real values live in localStorage
 * (first touch), and stamping the organic defaults here would relabel a genuine
 * ad click as organic, which is worse than the funnel recording it as unknown
 * for the few hundred ms until buildScorecardUrl() takes over.
 */
export function baseScorecardUrl(): string {
  const dest = new URL(SCORECARD_BASE_URL);
  dest.searchParams.set("lp", LP_SLUG);
  return dest.toString();
}

/**
 * Build the full scorecard URL with every value we have. Values are set via
 * URLSearchParams (URL-encoded for us); any param we lack is omitted entirely,
 * never an empty param.
 */
export function buildScorecardUrl(): string {
  const dest = new URL(SCORECARD_BASE_URL);
  const ft = getStoredFirstTouch();

  const params: Record<string, string | undefined> = {
    // Real ad-click attribution wins; organic visitors fall back to defaults.
    utm_source: ft.utmSource ?? DEFAULT_UTMS.utm_source,
    utm_medium: ft.utmMedium ?? DEFAULT_UTMS.utm_medium,
    utm_campaign: ft.utmCampaign ?? DEFAULT_UTMS.utm_campaign,
    utm_term: ft.utmTerm,
    utm_content: ft.utmContent,
    // fbclid is what attributes the eventual Lead/Purchase (fired on the
    // scorecard) back to this ad click: aimerge.live's pixel reads it and sets
    // the _fbc cookie automatically.
    fbclid: ft.fbclid,
    gclid: ft.gclid,
    ttclid: ft.ttclid,
    msclkid: ft.msclkid,
    // Forward THIS page's Meta browser cookies so the scorecard can pass them
    // to the Conversions API for higher match quality. Best-effort.
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ref: getOrCreateVisitorRef(),
    lp: LP_SLUG,
  };

  for (const [key, value] of Object.entries(params)) {
    if (value) dest.searchParams.set(key, value);
  }

  return dest.toString();
}
