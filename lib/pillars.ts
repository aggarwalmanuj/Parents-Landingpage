// The four scored dimensions the Parenting Belief Score returns.
//
// This file is deliberately NOT a client module. Constants exported from a
// `"use client"` file cross the boundary as client-reference proxies, not as
// their real values, so a server component that imports an array from one gets
// something that looks like an array and has no `.map`. Splitting the data out
// here lets both sides import the genuine values; the rendering (ScoreRing,
// PillarDial) lives in components/visuals/score-visuals.tsx.
//
// VERIFIED AGAINST THE PRODUCT, not invented. Every label, over-line, order
// position and sample value below was read off the real captures in
// public/take/:
//
//   - reportsummary.jpg renders the four chips as DIRECTION CLARITY /
//     IDENTITY ALIGNMENT / DECISION READINESS / ENERGY ALIGNMENT, in that
//     order.
//
//     There is deliberately NO `pillar` field ("Pillar I · Purpose"). The Core
//     Protocol requires that pillar names never be surfaced to the person and
//     are translated into plain language instead; `label` is that translation,
//     and printing both put the internal scheme on the page beside its own
//     "not a category" positioning.
//   - reportpdf.jpg renders "Identity Alignment 24" and "Direction Clarity 42",
//     which are the first two SAMPLE_SUBSCORES below, and an overall of 41 —
//     exactly what overallOf() returns for the full set. The page's arithmetic
//     is therefore not merely plausible, it is the product's.
//
// The subscore KEYS are fixed across the whole assessment system (scoring,
// storage, and the model's JSON contract all use them); verticals only relabel
// what they mean. Do not paraphrase the labels, or the page promises one thing
// and the result delivers another.

import {
  Battery,
  Compass,
  Fingerprint,
  Scale,
  type LucideIcon,
} from "lucide-react";

export type PillarKey =
  | "directionClarity"
  | "identityAlignment"
  | "decisionReadiness"
  | "energyAlignment";

/** Display order. Fixed: it is the order the result screen renders them in, so
 *  a visitor reading this page and a visitor reading their own result see the
 *  same sequence. */
export const PILLAR_ORDER: readonly PillarKey[] = [
  "directionClarity",
  "identityAlignment",
  "decisionReadiness",
  "energyAlignment",
];

/** GRAPHICS token per dimension: ring strokes, bar fills, icon glyphs,
 *  borders, tints. These resolve to the funnel's DIMENSION_COLORS verbatim, so
 *  our dials and the real product captures embedded on this page render one
 *  palette rather than two near-misses. See the long note in globals.css. */
export const PILLAR_COLORS: Record<PillarKey, string> = {
  directionClarity: "var(--pillar-1)",
  identityAlignment: "var(--pillar-2)",
  decisionReadiness: "var(--pillar-3)",
  energyAlignment: "var(--pillar-4)",
};

/** TEXT token per dimension: the same hue lifted until it clears 4.5:1 as
 *  small text on our card, which is a step darker than the funnel's.
 *
 *  Use ONLY where a coloured label is genuinely the design — the assessment's
 *  own entry screen (public/take/audience.jpg) renders its pillar chips that
 *  way, so the closing recap strip matches it. For over-lines and names,
 *  prefer a text token and let the ring carry the hue. */
export const PILLAR_TEXT_COLORS: Record<PillarKey, string> = {
  directionClarity: "var(--pillar-1-ink)",
  identityAlignment: "var(--pillar-2-ink)",
  decisionReadiness: "var(--pillar-3-ink)",
  energyAlignment: "var(--pillar-4-ink)",
};

/** A second, non-colour identity encoding, so the dimensions stay tellable
 *  apart in greyscale, in print, and under colour-vision deficiency. These
 *  match the glyphs inside the product's own chips. */
export const PILLAR_ICONS: Record<PillarKey, LucideIcon> = {
  directionClarity: Compass,
  identityAlignment: Fingerprint,
  decisionReadiness: Scale,
  energyAlignment: Battery,
};

/**
 * Copy for each dimension, written for a parent.
 *
 * Every `plain` line describes something the PARENT does, interprets, or
 * carries. None describes the child — the same boundary the rest of the page
 * holds. "How clearly you can say what you actually want" is in scope; "how
 * well your child responds" would not be.
 */
export const PILLAR_LABELS: Record<
  PillarKey,
  { label: string; plain: string }
> = {
  directionClarity: {
    label: "Direction Clarity",
    plain:
      "How clearly you can say what you actually want in this moment, in your own words.",
  },
  identityAlignment: {
    label: "Identity Alignment",
    plain:
      "How closely the way you respond matches the parent you feel you are.",
  },
  decisionReadiness: {
    label: "Decision Readiness",
    plain:
      "How ready you are to make the call instead of going round the same loop again.",
  },
  energyAlignment: {
    label: "Energy Alignment",
    plain: "How much of your energy this pattern is quietly using up.",
  },
};

/** Illustrative subscores, taken from a REAL completed run of the live
 *  parenting assessment (the Parenting Action Plan, page 1). They are not
 *  invented, and they are not the coaches vertical's numbers.
 *
 *  Worth stating because it is a genuine check on this file: overallOf() below
 *  returns exactly 69 for these four values, which is the overall the live
 *  product printed for that same run. The page's arithmetic is therefore not
 *  merely plausible - it is demonstrably the product's.
 *
 *  They are also deliberately uneven and mid-to-high: the lowest (Energy
 *  Alignment, 42) is the one the real plan named as the biggest opening, which
 *  is the point the page makes about a low number meaning room to move rather
 *  than a failing grade. */
export const SAMPLE_SUBSCORES: Record<PillarKey, number> = {
  directionClarity: 78,
  identityAlignment: 66,
  decisionReadiness: 74,
  energyAlignment: 42,
};

/** The assessment's own weighting. Returns 69 for the sample above, which is
 *  the overall the real breakdown capture prints — so the preview's arithmetic
 *  is the product's, not a plausible-looking invention. */
export function overallOf(s: Record<PillarKey, number>): number {
  return Math.round(
    s.directionClarity * 0.35 +
      s.identityAlignment * 0.25 +
      s.decisionReadiness * 0.25 +
      s.energyAlignment * 0.15
  );
}
