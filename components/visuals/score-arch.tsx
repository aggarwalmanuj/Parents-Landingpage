"use client";

/* ==========================================================================
   THE SCORE ARCH — the page's central explanation of what the number is.

   Why an arch and not another ring: a ring says "a value exists". An arch has
   a LEFT END and a RIGHT END, so it can carry meaning at both extremes and a
   marker between them. That is the whole job here — a parent must leave this
   graphic knowing what a low number means, what a high number means, and
   roughly where a result sits — before they are asked to spend ten minutes
   earning one.

   Two honesty constraints are structural, not stylistic:

   1. The marker is the product's own illustrative overall (41 — the value
      overallOf(SAMPLE_SUBSCORES) returns, and the number the real breakdown
      capture in public/take/ prints). It is chipped "Illustrative" inside the
      figure, not only in a caption underneath, because a caption is the part
      that gets cropped out of a screenshot.

   2. The dashed tick is 48, and it is the PRODUCT'S OWN published benchmark,
      not a number invented for this page. The funnel exports
      `BENCHMARK_MEAN = 48` (scorecard-funnel/lib/scoring.ts), its score prompt
      is calibrated to that mean, and its summary screen tells every
      participant "Most people start near 48" in those words. This page uses
      the same figure and the same sentence, so a visitor who takes the
      assessment meets one benchmark rather than two.

      It is a designed benchmark, not a measured population average. If the
      funnel's constant ever moves, move this with it.

   3. The two bands quoted below are the funnel's real band boundaries from
      `bandFor()` in the same file: under 36 is "High leverage", 76 and above
      is "Dialed in". Quoting round-looking numbers instead (0-39, 70-100)
      would mean the page describes a scale the product does not use.

   Colour: the arc runs muted -> --signal, low to high. Deliberately NOT the
   four --pillar-N hues, which are CATEGORICAL (each identifies one dimension
   and nothing else); spending them on a sequential scale would make orange
   mean "Identity Alignment" in one section and "a lowish score" in this one.
   And deliberately not red-to-green, which would turn a reflective scale into
   a report card.
========================================================================== */

import { useEffect, useState } from "react";

/* Geometry. viewBox 0 0 400 210: a half-circle of radius 150 centred at
   (200, 185), so the arc runs from (50,185) up over (200,35) to (350,185) and
   a 20px stroke still clears the top edge. */
const CX = 200;
const CY = 185;
const R = 150;
const ARC_LENGTH = Math.PI * R;
const ARC_PATH = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

/** Cartesian point for a 0-100 value on the arc (0 = left end, 100 = right). */
function pointAt(value: number, radius = R) {
  const t = Math.min(100, Math.max(0, value)) / 100;
  const angle = Math.PI * (1 - t);
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
}

const BANDS = [
  {
    range: "Under 36",
    title: "The moment is deciding for you",
    body: "The response arrives before you have chosen it. Something you haven’t named yet is doing the deciding - so the same conversation keeps repeating. This is where the most room to move sits.",
  },
  {
    range: "76 and above",
    title: "You are deciding",
    body: "You can say what you actually want, respond like the parent you know you are, and let the moment end without needing to go round it again.",
  },
];

export function ScoreArch({
  value = 41,
  average = 48,
}: {
  /** The illustrative result the marker sits on. */
  value?: number;
  /** The published benchmark. 48 = the funnel's BENCHMARK_MEAN. */
  average?: number;
}) {
  // Paint the arc empty on the first frame, then let CSS move it. Same
  // technique as ScoreRing (one rAF, one boolean, no JS ticker) so the arch
  // and the dials on this page animate as one system.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const marker = pointAt(value);
  const avgInner = pointAt(average, R - 16);
  const avgOuter = pointAt(average, R + 16);

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className="relative mx-auto w-full max-w-xl">
        <svg
          viewBox="0 0 400 210"
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label={`A 0 to 100 scale drawn as an arch. 0 means the moment is deciding for you; 100 means you are deciding. An illustrative result of ${value} is marked, and most people start near ${average}.`}
        >
          <defs>
            <linearGradient
              id="arch-scale"
              gradientUnits="userSpaceOnUse"
              x1={CX - R}
              y1="0"
              x2={CX + R}
              y2="0"
            >
              <stop offset="0%" stopColor="var(--muted-foreground)" />
              <stop offset="55%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--signal)" />
            </linearGradient>
          </defs>

          {/* Track. Full scale, always visible, so the arc's fill reads as a
              position ON something rather than as a floating shape. */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="var(--border)"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Filled portion, 0 -> value. */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="url(#arch-scale)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={
              ARC_LENGTH * (1 - (mounted ? Math.min(100, Math.max(0, value)) : 0) / 100)
            }
            style={{
              transition: "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {/* Reference tick. Dashed so it never competes with the marker. */}
          <line
            x1={avgInner.x}
            y1={avgInner.y}
            x2={avgOuter.x}
            y2={avgOuter.y}
            stroke="var(--muted-foreground)"
            strokeWidth="2"
            strokeDasharray="3 3"
            opacity="0.85"
          />
          {/* The tick's LABEL is HTML, below the figure. SVG <text> sits in
              user units, so it shrinks with the viewBox — at a 360px viewport
              this string rendered around 11px, under the page's 12px floor,
              on the audience least able to absorb that. */}

          {/* The marker. Ground-coloured fill so the arc reads as passing
              behind it, teal ring so it is unmistakably the one thing to look
              at on the curve. */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r="13"
            fill="var(--background)"
            stroke="var(--signal)"
            strokeWidth="4"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 500ms 900ms ease-out",
            }}
          />
        </svg>

        {/* Centre readout, in HTML rather than SVG text so it takes the page's
            real type tokens and scales with the reader's font settings. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] text-center">
          <p className="font-serif text-5xl leading-none tabular-nums text-ink sm:text-6xl">
            {value}
          </p>
          <p className="mt-2 text-[12px] uppercase tracking-[0.16em] text-faint">
            out of 100
          </p>
          <p className="mt-3 inline-block rounded-full border border-line px-2.5 py-0.5 text-[11px] uppercase tracking-[0.14em] text-faint">
            Illustrative
          </p>
        </div>
      </div>

      {/* Legend for the dashed tick. The wording is the funnel's own sentence
          to the participant, verbatim. */}
      <p className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.14em] text-faint">
        <span
          aria-hidden
          className="inline-block h-0 w-6 border-t-2 border-dashed border-current align-middle"
        />
        Most people start near {average}
      </p>

      {/* The two ends, written out. Left card sits under the left end of the
          arch and right under the right, so the reading order and the graphic
          agree without a legend. */}
      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
        {BANDS.map((band, i) => (
          <div
            key={band.range}
            className="rounded-xl border border-line bg-card p-5 sm:p-6"
            style={
              i === 1
                ? {
                    borderColor:
                      "color-mix(in srgb, var(--signal) 30%, var(--border))",
                  }
                : undefined
            }
          >
            <p className="text-[12px] uppercase tracking-[0.16em] text-faint">
              {band.range}
            </p>
            <p className="mt-2 font-serif text-xl leading-snug text-ink">
              {band.title}
            </p>
            <p className="mt-3 text-[15px] leading-[1.75] text-muted">
              {band.body}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="mt-6 text-center text-sm leading-relaxed text-faint">
        It is not a grade, and it does not rate you as a parent, your child, or
        your family. A lower number means more room to move.
      </figcaption>
    </figure>
  );
}
