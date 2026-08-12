// First-touch attribution + safe PostHog wrappers.
// Everything here is defensive: attribution must never break the page.

// posthog-js is reached through the lazy holder, never imported directly: a
// static import here would pull the whole library back into the initial bundle
// for the sake of three functions that all no-op until consent anyway.
import { getPostHog } from "./posthog-client";

const STORAGE_KEY = "hf-first-touch";

export type FirstTouch = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  msclkid?: string;
};

export type LeadAttribution = FirstTouch & {
  posthogSessionId?: string;
  posthogDistinctId?: string;
};

/** Campaign-grade signal: a real ad/campaign marker, not just a referrer
 *  or a landing-page URL. Only these make a first-touch record final. */
function hasCampaignSignal(t: FirstTouch): boolean {
  return Boolean(
    t.utmSource ||
      t.utmMedium ||
      t.utmCampaign ||
      t.utmTerm ||
      t.utmContent ||
      t.fbclid ||
      t.gclid ||
      t.ttclid ||
      t.msclkid
  );
}

/**
 * Store the acquiring channel exactly once. The lead usually converts minutes
 * after landing, when the UTM query string is long gone, a return visit must
 * not overwrite first touch.
 */
export function captureFirstTouchAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    // First touch wins - with one deliberate exception. A stored record
    // that carries NO campaign data (a direct/organic visit, which still
    // writes landingPage/referrer) used to block every later ad click from
    // ever being recorded, because buildScorecardUrl reads only from
    // storage and never from the live URL. That silently unattributed the
    // paid click that actually drove the conversion. So: a record without
    // campaign data is upgradeable; a record WITH campaign data is final.
    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      let existing: FirstTouch | null = null;
      try {
        existing = JSON.parse(existingRaw) as FirstTouch;
      } catch {
        existing = null;
      }
      if (existing && hasCampaignSignal(existing)) return;
    }
    const params = new URLSearchParams(window.location.search);
    const get = (k: string) => params.get(k)?.slice(0, 500) || undefined;
    const touch: FirstTouch = {
      landingPage: window.location.href.slice(0, 500),
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      utmSource: get("utm_source"),
      utmMedium: get("utm_medium"),
      utmCampaign: get("utm_campaign"),
      utmTerm: get("utm_term"),
      utmContent: get("utm_content"),
      fbclid: get("fbclid"),
      gclid: get("gclid"),
      ttclid: get("ttclid"),
      msclkid: get("msclkid"),
    };
    // Don't let one no-campaign record replace another (keeps the first
    // referrer/landing page), but always allow a campaign upgrade.
    if (existingRaw && !hasCampaignSignal(touch)) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
  } catch {
    // localStorage unavailable (private mode, etc.), never break the page.
  }
}

export function getPostHogIds(): Pick<
  LeadAttribution,
  "posthogSessionId" | "posthogDistinctId"
> {
  try {
    const posthog = getPostHog();
    if (typeof window === "undefined" || !posthog?.__loaded) return {};
    return {
      posthogSessionId: posthog.get_session_id() || undefined,
      posthogDistinctId: posthog.get_distinct_id() || undefined,
    };
  } catch {
    return {};
  }
}

/** Read the persisted first-touch record (channel + click ids). Empty if none. */
export function getStoredFirstTouch(): FirstTouch {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FirstTouch;
  } catch {
    // ignore, corrupt/unavailable storage must never break the page.
  }
  return {};
}

/** Attached to every outbound scorecard handoff. */
export function getLeadAttribution(): LeadAttribution {
  return { ...getStoredFirstTouch(), ...getPostHogIds() };
}

export function phCapture(event: string, props?: Record<string, unknown>): void {
  try {
    const posthog = getPostHog();
    if (typeof window === "undefined" || !posthog?.__loaded) return;
    posthog.capture(event, props);
  } catch {
    // ignore
  }
}

export function phIdentify(id: string, props?: Record<string, unknown>): void {
  try {
    const posthog = getPostHog();
    if (typeof window === "undefined" || !posthog?.__loaded) return;
    posthog.identify(id, props);
  } catch {
    // ignore
  }
}
