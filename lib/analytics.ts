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
 * sections of the Parenting Belief Score landing page, so the funnel report can
 * tell WHICH argument produced the click:
 *
 *   hero            — above the VSL
 *   drift           — I, the distance drawn as it accumulates
 *   pattern         — II, the part of it they can still change
 *   score           — III, what the number means (the arch)
 *   what_arrives    — IV, the score, the breakdown, the program
 *   founder         — VI, who built it + proof
 *   faq             — VII, questions parents ask
 *   final           — the closing CTA
 *   mobile_sticky   — the persistent mobile bar
 *   header          — the sticky header CTA
 *
 * RENAMED 2026-08-12 with the narrative rebuild. The retired names were
 * `question`, `score_visual`, `recognition`, `whats_inside` and
 * `how_it_works`; any saved PostHog funnel or dashboard filtering on those
 * needs repointing rather than silently reporting zero.
 */
export type CtaLocation =
  | "header"
  | "hero"
  | "drift"
  | "pattern"
  | "score"
  | "what_arrives"
  | "founder"
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
