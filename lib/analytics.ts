// Unified funnel-event helper. Every doc-specified analytics event
// (landing_page_view, scroll_depth_*, vsl_*, cta_click, section views) flows
// through here so PostHog and the Meta Pixel always see the same event names
// and payloads. Both sinks are consent-gated upstream and no-op safely when
// absent.

import posthog from "posthog-js";
import { trackCustom } from "./fbpixel";
import { LP_SLUG } from "./scorecard";

/**
 * CTA placements the doc requires distinct tracking for. These map 1:1 to the
 * blocks of the Parenting Belief Score landing page, so the funnel report can
 * tell WHICH argument produced the click:
 *
 *   hero            — Block 01, above the VSL
 *   question        — Block 03, the one additional question
 *   score_visual    — Block 04, "How your words become your score" + score card
 *   recognition     — Block 05, patterns become visible in ordinary moments
 *   whats_inside    — Block 06, what's inside your score
 *   founder         — Block 08, why I built this
 *   how_it_works    — Block 11, five questions / one moment / your result
 *   faq             — Block 12, questions parents ask
 *   final           — Block 13, closing CTA
 *   mobile_sticky   — the persistent mobile bar
 *   header          — the sticky header CTA
 */
export type CtaLocation =
  | "header"
  | "hero"
  | "question"
  | "score_visual"
  | "recognition"
  | "whats_inside"
  | "founder"
  | "how_it_works"
  | "faq"
  | "final"
  | "mobile_sticky"
  // Answer-engine pages. Tracked separately so organic/AI-referred traffic
  // that lands on /faq or /glossary can be told apart from doorway traffic in
  // the funnel report.
  | "faq_page"
  | "glossary_page"
  | "not_found";

export function trackEvent(
  name: string,
  props?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const payload = { lp: LP_SLUG, ...props };
  try {
    // __loaded is false until posthog.init runs (i.e. before consent).
    if (posthog.__loaded) posthog.capture(name, payload);
  } catch {
    // Analytics must never break the page.
  }
  trackCustom(name, payload);
}
