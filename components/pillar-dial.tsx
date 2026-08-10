// The four scored dimensions, drawn as dials.
//
// Why the page needs this: "What's inside your score" describes the result in
// prose, but the result the visitor actually receives is a NUMBER across four
// named dimensions — which is what the live capture shows. Without this the
// page never states, in its own voice, what it is measuring, and the reader
// meets the four dimensions for the first time in a screenshot they cannot
// read.
//
// The pillar palette is categorical: colour says WHICH dimension, never how
// good the number is. A low Energy Alignment is not "worse orange" than a high
// one. Every dial carries an icon, an over-line, a label, the value, and a
// plain-language reading — colour is the fifth encoding, never the only one.
//
// Server-rendered: no state, no client boundary. The ring is inline SVG so it
// costs no JavaScript and stays crisp at any size.

import { Compass, Fingerprint, Scale, Battery } from "lucide-react";

export type PillarKey =
  | "directionClarity"
  | "identityAlignment"
  | "decisionReadiness"
  | "energyAlignment";

/** Fixed order. It matches the live result screen, so a visitor reading the
 *  page and a visitor reading their own result see the same sequence. */
export const PILLAR_ORDER: PillarKey[] = [
  "directionClarity",
  "identityAlignment",
  "decisionReadiness",
  "energyAlignment",
];

export const PILLAR_COLORS: Record<PillarKey, string> = {
  directionClarity: "var(--pillar-1)",
  identityAlignment: "var(--pillar-2)",
  decisionReadiness: "var(--pillar-3)",
  energyAlignment: "var(--pillar-4)",
};

const PILLAR_ICONS = {
  directionClarity: Compass,
  identityAlignment: Fingerprint,
  decisionReadiness: Scale,
  energyAlignment: Battery,
} as const;

/**
 * Copy for each dimension, written for a parent.
 *
 * Every `plain` line describes something the PARENT does, interprets, or
 * carries. None describes the child — the same boundary the rest of the page
 * holds. "How clearly you can say what you actually want" is in scope; "how
 * well your child responds" would not be.
 */
const PILLAR_LABELS: Record<
  PillarKey,
  { pillar: string; label: string; plain: string }
> = {
  directionClarity: {
    pillar: "Pillar I · Purpose",
    label: "Direction Clarity",
    plain:
      "How clearly you can say what you actually want in this moment, in your own words.",
  },
  identityAlignment: {
    pillar: "Pillar II · Identity",
    label: "Identity Alignment",
    plain:
      "How closely the way you respond matches the parent you feel you are.",
  },
  decisionReadiness: {
    pillar: "Pillar III · Peace of mind",
    label: "Decision Readiness",
    plain:
      "How ready you are to make the call instead of going round the same loop again.",
  },
  energyAlignment: {
    pillar: "Pillar IV · Embodiment",
    label: "Energy Alignment",
    plain: "How much of your energy this pattern is quietly using up.",
  },
};

/** Illustrative values. Deliberately mid-range and uneven: a demo showing four
 *  high numbers would read as a score to beat, and four low ones as a verdict.
 *  The caption under the grid states they are illustrative. */
export const SAMPLE_SUBSCORES: Record<PillarKey, number> = {
  directionClarity: 42,
  identityAlignment: 24,
  decisionReadiness: 46,
  energyAlignment: 58,
};

function ScoreRing({
  value,
  color,
  size = 68,
  stroke = 5,
}: {
  value: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  // The arc is drawn with a dash offset rather than a path arc so the value can
  // never produce an invalid path at 0 or 100.
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {/* Value arc, starting at 12 o'clock */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute font-serif text-[19px] leading-none tabular-nums text-fg">
        {value}
      </span>
    </span>
  );
}

export function PillarDial({
  dimension,
  value,
}: {
  dimension: PillarKey;
  value: number;
}) {
  const color = PILLAR_COLORS[dimension];
  const Icon = PILLAR_ICONS[dimension];
  const { label, pillar, plain } = PILLAR_LABELS[dimension];

  return (
    <div
      className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors duration-500 sm:p-6"
      // The card's own border picks up a trace of its dimension's hue, so the
      // four read as a set of related objects rather than four identical cards
      // that happen to contain different colours.
      style={{ borderColor: `color-mix(in srgb, ${color} 28%, var(--border))` }}
    >
      <div className="flex w-full items-center gap-4">
        <ScoreRing value={value} color={color} />
        <div className="min-w-0">
          <p
            className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em]"
            style={{ color }}
          >
            <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
            {pillar}
          </p>
          <p className="mt-1 font-serif text-[17px] leading-snug text-fg">
            {label}
          </p>
        </div>
      </div>
      <p className="text-[14px] leading-[1.7] text-muted">{plain}</p>
    </div>
  );
}
