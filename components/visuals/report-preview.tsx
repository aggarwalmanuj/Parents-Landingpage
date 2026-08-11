"use client";

// A stylized page one of the result artifact: the product made visible,
// rendered from our own live tokens rather than photographed.
//
// Two honesty rules are enforced by the STRUCTURE here, not by good
// intentions:
//
//  1. Narrative content renders as "redaction" bars, never as invented
//     sentences. The written half cannot exist before the parent answers, and
//     filling it with plausible prose would be fabricating somebody's result —
//     which on this page would also mean publishing an invented belief
//     hypothesis about a family that does not exist. The bars are honest about
//     being personalised while still showing the exact shape of what arrives.
//  2. The numbers are illustrative, and the "Illustrative example" chip lives
//     INSIDE the artifact rather than only in a caption beneath it. That is a
//     compliance requirement, not a design choice: a caption is a separate
//     element that can be cropped out of a screenshot, scrolled past, or
//     dropped by a future call site. The label travels with the thing it
//     labels.

import { ScoreRing } from "@/components/visuals/score-visuals";
import {
  PILLAR_COLORS,
  PILLAR_ICONS,
  PILLAR_LABELS,
  PILLAR_ORDER,
  SAMPLE_SUBSCORES,
  overallOf,
  type PillarKey,
} from "@/lib/pillars";

export function ReportPreviewCard({
  subscores = SAMPLE_SUBSCORES,
  animate = true,
}: {
  subscores?: Record<PillarKey, number>;
  animate?: boolean;
}) {
  const overall = overallOf(subscores);

  return (
    <div className="bg-card p-5 sm:p-6">
      {/* Document header. `min-w-0` on the truncating span is load-bearing,
          not tidiness: `truncate` includes `white-space: nowrap`, and a nowrap
          flex item contributes its FULL string width to its ancestors'
          min-content. This card sits in a grid that collapses to ONE column
          below `lg`, so an unshrinkable header would propagate up and force
          the whole mobile column wider than a 320px screen — clipped silently
          by the page's `overflow-x: clip`, which hides the scrollbar but not
          the damage. `flex-wrap` is the belt: on the narrowest screens the
          chip drops to its own line rather than squeezing the title away. */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line pb-4">
        <span className="min-w-0 flex-1 truncate text-[9px] uppercase tracking-[0.2em] text-faint">
          Parenting Belief Score
        </span>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] text-faint">
          Illustrative example
        </span>
      </div>

      {/* Score hero row. The overall ring is --signal, not a pillar colour:
          it is not one of the four dimensions. */}
      <div className="flex items-center gap-5">
        <ScoreRing
          value={overall}
          size={84}
          stroke={7}
          color="var(--signal)"
          animate={animate}
        >
          <span className="font-serif text-[26px] leading-none tabular-nums text-fg">
            {overall}
          </span>
        </ScoreRing>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-faint">
            Your score · out of 100
          </p>
          {/* The personalised thesis sentence, abstracted to two ink bars. */}
          <div className="mt-2.5 space-y-1.5" aria-hidden>
            <div className="h-2 w-11/12 rounded-full bg-fg/25" />
            <div className="h-2 w-7/12 rounded-full bg-fg/15" />
          </div>
        </div>
      </div>

      {/* The four scored dimensions. Icon chip, label, proportional bar, and
          value: four encodings, only one of which is colour. */}
      <div className="mt-6 space-y-3">
        {PILLAR_ORDER.map((k) => {
          const Icon = PILLAR_ICONS[k];
          const color = PILLAR_COLORS[k];
          const v = subscores[k];
          return (
            <div key={k} className="flex items-center gap-2.5">
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `color-mix(in srgb, ${color} 18%, transparent)`,
                  color,
                }}
              >
                <Icon className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
              </span>
              {/* w-28 at every width, and tighter tracking than the page's
                  other eyebrows. "IDENTITY ALIGNMENT" is 18 characters, and at
                  a narrower box it truncates to "IDENTITY ALIGNM…" on a 390px
                  phone — a dimension name a visitor cannot read is worse than
                  no dimension name. The bar flexes into whatever is left, and
                  all four bars stay on one scale because they flex alike. */}
              <span className="w-28 shrink-0 truncate text-[9.5px] uppercase tracking-[0.04em] text-faint">
                {PILLAR_LABELS[k].label}
              </span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-fg/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${v}%`, background: color }}
                />
              </span>
              <span className="w-6 text-right font-serif text-[11px] tabular-nums text-fg">
                {v}
              </span>
            </div>
          );
        })}
      </div>

      {/* The written half, abstracted. See rule 1 above. */}
      <div className="mt-6 space-y-1.5 border-t border-line pt-4" aria-hidden>
        <div className="h-1.5 w-full rounded-full bg-fg/10" />
        <div className="h-1.5 w-10/12 rounded-full bg-fg/10" />
        <div className="h-1.5 w-11/12 rounded-full bg-fg/5" />
        <div className="h-1.5 w-5/12 rounded-full bg-fg/5" />
      </div>

      <p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-faint">
        Built from your own words
      </p>
    </div>
  );
}
