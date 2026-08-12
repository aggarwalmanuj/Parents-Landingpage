// Unified funnel-event helper. Every doc-specified analytics event
// (landing_page_view, scroll_depth_*, vsl_*, cta_click, section views) flows
// through here so PostHog and the Meta Pixel always see the same event names
// and payloads. Both sinks are consent-gated upstream and no-op safely when
// absent.

import posthog from "posthog-js";
import { getConsent, onConsentChange } from "./consent";
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

type QueuedEvent = { name: string; payload: Record<string, unknown> };

/**
 * Events emitted before the visitor answers the cookie banner had nowhere to
 * go: PostHog is not initialised and fbevents.js is not injected until Accept,
 * so both sinks silently swallowed them and nothing replayed them afterwards.
 *
 * `landing_page_view` fires exactly once, from LandingAnalytics' mount effect -
 * i.e. ALWAYS inside that window on a first visit. So the funnel's top-of-
 * funnel event was never recorded for a new visitor, while the cta_click they
 * went on to produce was: the conversion rate had no denominator. Section
 * views scrolled past before the banner was answered were lost the same way.
 *
 * An unsent event now waits in memory instead. Nothing is persisted and
 * nothing leaves the browser before consent is granted, so the consent model
 * is unchanged; an explicit denial both discards what is held AND stops any
 * further queueing, so a later change of mind can never replay events from the
 * stretch where the visitor had said no.
 *
 * Each sink owns its queue, its retry chain and its give-up budget, because
 * the two become available at different moments - posthog.init() is
 * synchronous on Accept, fbevents.js lands a few hundred ms later, and an ad
 * blocker can stop it arriving at all. Sharing any of the three would let a
 * blocked pixel discard PostHog's backlog, or let one queue double-send to
 * whichever sink was already caught up.
 */
const PENDING_LIMIT = 50;
const RETRY_MS = 150;
/** 30 x 150ms = 4.5s, the same budget trackWhenReady() already allows
 *  fbevents.js. Past that the sink is treated as blocked for this batch. */
const RETRY_ATTEMPTS = 30;

/** True once the event is spoken for: sent, or dropped because the sink threw
 *  and retrying would loop forever. False only means "sink not ready yet". */
function sendToPostHog(e: QueuedEvent): boolean {
  try {
    // __loaded is false until posthog.init runs (i.e. before consent).
    if (!posthog.__loaded) return false;
    posthog.capture(e.name, e.payload);
  } catch {
    // Analytics must never break the page.
  }
  return true;
}

function sendToPixel(e: QueuedEvent): boolean {
  try {
    if (!window.fbq) return false;
    trackCustom(e.name, e.payload);
  } catch {
    // Analytics must never break the page. This guard is not symmetry for its
    // own sake: some privacy extensions REPLACE window.fbq with a stub rather
    // than blocking the script, and an unguarded throw escaped trackEvent
    // entirely - past the PostHog send beside it, and on into whatever emitted
    // the event: a useEffect body, an IntersectionObserver callback, a click
    // handler. One hostile global should cost one pixel call, nothing more.
  }
  return true;
}

/** One sink's replay state. */
type Sink = {
  /** Events emitted while this sink did not yet exist, oldest first. */
  pending: QueuedEvent[];
  send: (e: QueuedEvent) => boolean;
  /** A retry tick is already scheduled. A second chain would duplicate the
   *  work but never the events - flush() shifts each one the instant it
   *  lands, synchronously, so a later chain finds it already gone. */
  draining: boolean;
};

const postHogSink: Sink = { pending: [], send: sendToPostHog, draining: false };
const pixelSink: Sink = { pending: [], send: sendToPixel, draining: false };
/** PostHog first: it is the funnel's system of record, the pixel is the ad
 *  platform's copy. */
const SINKS: readonly Sink[] = [postHogSink, pixelSink];

function flush(sink: Sink): void {
  while (sink.pending.length > 0 && sink.send(sink.pending[0])) {
    sink.pending.shift();
  }
}

/**
 * Chase ONE sink until it takes its backlog or the budget runs out.
 *
 * Self-arming (from enqueue) is what makes a held event safe. The drain fired
 * at consent time cannot cover an event queued after it, and leaving the
 * release to the NEXT trackEvent call meant an already-consented visitor who
 * landed and bounced without scrolling never released the event they had
 * already generated: their landing_page_view sat in the pixel queue until the
 * page unloaded.
 */
function scheduleDrain(sink: Sink, attemptsLeft = RETRY_ATTEMPTS): void {
  if (sink.draining) return;
  sink.draining = true;
  window.setTimeout(() => {
    sink.draining = false;
    // Flush BEFORE the give-up check, so the final tick still gets to deliver.
    flush(sink);
    if (sink.pending.length === 0) return;
    // Budget spent with nothing listening. Drop THIS sink's backlog only -
    // the other sink may be perfectly healthy and mid-flush.
    if (attemptsLeft <= 1) {
      sink.pending.length = 0;
      return;
    }
    scheduleDrain(sink, attemptsLeft - 1);
  }, RETRY_MS);
}

/** A full queue drops the NEWEST event. The oldest are the ones that cannot be
 *  re-derived - landing_page_view happens once and never again. */
function enqueue(sink: Sink, e: QueuedEvent): void {
  if (sink.pending.length < PENDING_LIMIT) sink.pending.push(e);
  // Only chase a sink that consent has actually released. While the banner is
  // still unanswered the event waits indefinitely, with no timer running -
  // that is the entire point, and arming the 4.5s budget here would discard
  // the landing_page_view of anyone who reads before deciding.
  if (getConsent() === "granted") scheduleDrain(sink);
}

export function trackEvent(
  name: string,
  props?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  // An explicit "no" is final: nothing is sent, and nothing is held back for a
  // later change of mind either.
  if (getConsent() === "denied") return;

  const event: QueuedEvent = { name, payload: { lp: LP_SLUG, ...props } };
  for (const sink of SINKS) {
    // Anything still waiting goes first, so a replayed event keeps its order
    // relative to the events that follow it.
    flush(sink);
    if (!sink.send(event)) enqueue(sink, event);
  }
}

// Consent is what makes the sinks exist, so it is what triggers the replay.
// A denial drops whatever is held: those events must never be sent.
if (typeof window !== "undefined") {
  const replayAll = () => {
    for (const sink of SINKS) {
      flush(sink);
      if (sink.pending.length > 0) scheduleDrain(sink);
    }
  };
  if (getConsent() === "granted") replayAll();
  else
    onConsentChange((value) => {
      if (value === "granted") replayAll();
      else for (const sink of SINKS) sink.pending.length = 0;
    });
}
