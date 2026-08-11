// Drawn scenes: the page's graphics for the sections that had none.
//
// WHY DRAWN AND NOT PHOTOGRAPHED
// Every moment these depict is a private family moment. Photographing them
// would mean staging a child, and the page's central boundary is that it
// examines the PARENT and never the child — so a child in frame would
// contradict the one thing these sections exist to establish. Stock
// photography of a family is manufactured proof, and this audience is exactly
// the one that would feel it. So each scene is drawn from the ARTIFACTS of the
// moment instead: a message thread, a plan with options attached, a decision
// card. No faces, nothing to mistake for a real family, nothing claimed.
//
// COLOUR RULE OBSERVED HERE
// Nothing in this file uses a --pillar-N hue. Those four colours identify the
// four scored DIMENSIONS and nothing else on this page; spending them on
// decoration would mean teal meant "Direction Clarity" in one section and
// "stage one of a loop" in another, which is exactly the failure the
// categorical-palette rule exists to prevent. These scenes are drawn in
// --signal and the ink neutrals.
//
// Server components: inline SVG plus tokens. No client JS, no image bytes, and
// they scale to any width without art direction.

import {
  ArrowDown,
  BellRing,
  Check,
  CircleHelp,
  EyeOff,
  FileText,
  Layers,
  MessageSquareText,
  PenLine,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  PILLAR_COLORS,
  PILLAR_LABELS,
  PILLAR_ORDER,
  SAMPLE_SUBSCORES,
} from "@/lib/pillars";

/* ==========================================================================
   THE LOOP — the mechanism the whole page turns on.

   The page states it in prose ("Concern drives intervention. Intervention
   hides what would have happened without it. The missing evidence feeds the
   concern again."). A reinforcing loop is a SHAPE, and a shape is the one
   thing prose is worst at. Drawn, it lands before the sentence is read, which
   is why this replaces two paragraphs rather than sitting beside them.
========================================================================== */

const LOOP_STAGES: { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: CircleHelp,
    label: "Concern rises",
    body: "Something matters, and not knowing starts to feel risky.",
  },
  {
    icon: BellRing,
    label: "You step in",
    body: "Another reminder. Another question. The responsible thing.",
  },
  {
    icon: EyeOff,
    label: "Nothing to compare",
    body: "Stepping in hides what would have happened if you hadn't.",
  },
];

export function BeliefLoop() {
  return (
    <figure className="relative">
      <figcaption className="eyebrow mb-6 flex items-center gap-3">
        <span className="inline-block h-px w-6 bg-line-strong" aria-hidden />
        The loop, drawn
      </figcaption>

      {/* The circuit.

          `pb-16 lg:pb-0 lg:pr-0` leaves room for the return path, which runs
          UNDER the row on desktop and DOWN the left rail on phones. The path
          itself is an absolutely-positioned SVG stretched with
          preserveAspectRatio="none"; `vector-effect="non-scaling-stroke"`
          keeps the stroke width AND the dash pattern resolving in screen
          units, so a stretched path still draws even dashes instead of
          smeared ones. That is what lets one SVG serve every viewport
          without a second art direction. */}
      <div className="relative pb-14 pl-8 lg:pb-16 lg:pl-0">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full text-signal"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Phone/tablet: down the left rail and back up to the top. */}
          <path
            className="loop-trace lg:hidden"
            d="M 4 6 L 4 94 L 96 94"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Desktop: under the row, right to left. */}
          <path
            className="loop-trace hidden lg:block"
            d="M 96 4 L 96 96 L 4 96 L 4 40"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <ol className="relative grid list-none gap-4 lg:grid-cols-3 lg:gap-5">
          {LOOP_STAGES.map(({ icon: Icon, label, body }, i) => (
            <li
              key={label}
              className="rise-in liftable rounded-xl border border-line bg-card p-5"
              style={{ ["--rise-delay" as string]: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
                  <Icon
                    className="h-4 w-4 text-signal"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] uppercase tracking-[0.16em] text-faint">
                    Stage {i + 1}
                  </span>
                  <span className="block font-serif text-[17px] leading-snug text-ink">
                    {label}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-[1.7] text-muted">{body}</p>
            </li>
          ))}
        </ol>

        {/* The return leg's label, sitting ON the path that closes the loop.

            It needs its own background: the dashed stroke runs behind it, and
            without a ground the dashes cut straight through the letterforms.
            `bg-surface` matches the section this renders in — the label has to
            punch a hole in the line, which is also how the line reads as
            passing behind it rather than through it. */}
        <p className="absolute bottom-0 left-8 flex items-center gap-2 bg-surface px-2 text-[12px] uppercase tracking-[0.16em] text-faint lg:left-1/2 lg:-translate-x-1/2">
          <ArrowDown className="h-3 w-3 rotate-90 text-signal" aria-hidden />
          and the concern returns
        </p>
      </div>
    </figure>
  );
}

/* ==========================================================================
   RECOGNITION SCENES — three ordinary moments, drawn from their artifacts.

   Each shows the SAME tell: a response that was reasonable on its own, and
   the trace it leaves behind. They read left to right without their captions,
   which is what a photograph would have been asked to do.
========================================================================== */

function SceneFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-bg/60 p-4">
      <p className="mb-3 text-[12px] uppercase tracking-[0.16em] text-faint">
        {label}
      </p>
      {children}
    </div>
  );
}

/** A message thread where the same message has now been sent three times. */
export function SceneReminder() {
  return (
    <SceneFrame label="Messages">
      <div className="space-y-2">
        {[
          { w: "72%", dim: true },
          { w: "58%", dim: true },
          { w: "66%", dim: false },
        ].map((row, i) => (
          <div key={i} className="flex justify-end">
            <span
              className="flex items-center gap-2 rounded-lg rounded-br-sm px-2.5 py-2"
              style={{
                width: row.w,
                background: row.dim
                  ? "color-mix(in srgb, var(--signal) 8%, transparent)"
                  : "color-mix(in srgb, var(--signal) 18%, transparent)",
                border: `1px solid color-mix(in srgb, var(--signal) ${
                  row.dim ? 16 : 38
                }%, transparent)`,
              }}
            >
              <span className="h-1.5 flex-1 rounded-full bg-fg/20" />
            </span>
          </div>
        ))}
      </div>
      {/* The tell: three sends, no reply, and the fourth already being typed. */}
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <PenLine className="h-3 w-3 shrink-0 text-signal" aria-hidden />
        <span className="text-[12px] text-faint">Typing a fourth…</span>
      </div>
    </SceneFrame>
  );
}

/** A plan that keeps gaining better options. */
export function SceneAdvice() {
  return (
    <SceneFrame label="The better option">
      <div className="flex items-start gap-2.5">
        <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
        <span className="space-y-1.5">
          <span className="block h-1.5 w-24 rounded-full bg-fg/20" />
          <span className="block h-1.5 w-16 rounded-full bg-fg/10" />
        </span>
      </div>
      {/* Three additions stacked onto one decision. */}
      <div className="mt-3 space-y-1.5">
        {["One more link", "Someone to talk to", "A safer route"].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-md border px-2.5 py-1.5"
            style={{
              borderColor: "color-mix(in srgb, var(--signal) 24%, var(--border))",
              background: "color-mix(in srgb, var(--signal) 5%, transparent)",
            }}
          >
            <Layers className="h-3 w-3 shrink-0 text-signal" aria-hidden />
            <span className="truncate text-[12px] text-muted">{item}</span>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
}

/** A choice already resolved before it was ever offered. */
export function SceneDecided() {
  return (
    <SceneFrame label="The decision">
      <div className="space-y-2">
        {[
          { label: "What they wanted", chosen: false },
          { label: "What felt safer", chosen: true },
        ].map((opt) => (
          <div
            key={opt.label}
            className="flex items-center gap-2.5 rounded-md border px-2.5 py-2"
            style={
              opt.chosen
                ? {
                    borderColor:
                      "color-mix(in srgb, var(--signal) 45%, transparent)",
                    background:
                      "color-mix(in srgb, var(--signal) 9%, transparent)",
                  }
                : {
                    borderColor: "var(--border)",
                    opacity: 0.45,
                  }
            }
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border"
              style={{
                borderColor: opt.chosen ? "var(--signal)" : "var(--border)",
                background: opt.chosen ? "var(--signal)" : "transparent",
              }}
              aria-hidden
            />
            <span className="truncate text-[12px] text-muted">{opt.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <MessageSquareText
          className="h-3 w-3 shrink-0 text-faint"
          aria-hidden
        />
        <span className="text-[12px] text-faint">Never actually asked</span>
      </div>
    </SceneFrame>
  );
}

export const RECOGNITION_SCENES = [
  {
    Scene: SceneReminder,
    caption: "The reminder that carried doubt with it.",
  },
  {
    Scene: SceneAdvice,
    caption: "The advice that became the main thing they heard.",
  },
  {
    Scene: SceneDecided,
    caption: "The choice that was made before it was offered.",
  },
] as const;

/* ==========================================================================
   THE CONTRAST — generic advice vs. your own description.

   Two panels of the same size and shape, so the difference between them is
   the only thing the eye has to do. Left: identical stacked category cards,
   dimmed, none of them yours. Right: one handwritten line resolving into the
   four scored dimensions. This replaces a section that was two sentences of
   type on an empty ground.
========================================================================== */

/** Left panel: a stack of interchangeable category cards. */
export function GenericAdvicePanel() {
  return (
    <div className="rounded-xl border border-line bg-bg/50 p-5" aria-hidden>
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-3.5 w-3.5 text-faint" />
        <span className="text-[12px] uppercase tracking-[0.16em] text-faint">
          Pick your category
        </span>
      </div>
      <div className="space-y-2">
        {["The anxious parent", "The over-involved parent", "The strict parent"].map(
          (cat, i) => (
            <div
              key={cat}
              className="flex items-center gap-2.5 rounded-md border border-line px-3 py-2.5"
              // Fading down the stack: the point is that they are
              // interchangeable and none of them is the reader.
              style={{ opacity: 0.72 - i * 0.18 }}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-line" />
              <span className="truncate text-[12px] text-faint">{cat}</span>
            </div>
          )
        )}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-line pt-4">
        <div className="h-1.5 w-full rounded-full bg-fg/8" />
        <div className="h-1.5 w-9/12 rounded-full bg-fg/8" />
        <div className="h-1.5 w-10/12 rounded-full bg-fg/5" />
      </div>
    </div>
  );
}

/**
 * Right panel: the parent's own sentence resolving into four scored bars.
 *
 * The bars are deliberately unlabelled and unnumbered here — this panel is
 * about WHERE the result comes from, not what it says. The named, valued,
 * icon-labelled version is the dial grid in the result section; repeating it
 * here would be the same graphic twice.
 */
export function YourWordsPanel() {
  return (
    <div
      className="rounded-xl border bg-card p-5"
      style={{
        borderColor: "color-mix(in srgb, var(--signal) 30%, var(--border))",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <PenLine className="h-3.5 w-3.5 text-signal" aria-hidden />
        <span className="text-[12px] uppercase tracking-[0.16em] text-faint">
          In your own words
        </span>
      </div>
      <blockquote className="font-serif-italic text-[15px] leading-[1.6] text-ink">
        &ldquo;I had already reminded them twice…&rdquo;
      </blockquote>
      <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
        <Sparkles className="h-3 w-3 shrink-0 text-signal" aria-hidden />
        <span className="text-[12px] uppercase tracking-[0.16em] text-faint">
          Scored across four dimensions
        </span>
      </div>
      {/* Four bars, in the four dimension colours and the fixed dimension
          order — the one place in this file a pillar hue appears, because here
          it genuinely IS identifying the dimensions.

          Each one is NAMED. Four coloured bars alone would be a colour-only
          encoding of the four dimensions, which is the one thing the
          categorical palette rule forbids: a reader with a colour-vision
          deficiency would see four identical grey bars and learn nothing.
          Order and values are read from lib/pillars.ts, so this panel and the
          dial grid further up the page cannot drift apart. */}
      <div className="mt-3 space-y-2">
        {PILLAR_ORDER.map((k) => (
          <span key={k} className="flex items-center gap-2.5">
            {/* w-32, not w-24. At w-24 the three longest names truncated to
                "Identity Alignm…", "Decision Readi…", "Energy Alignm…" on a
                390px phone — a dimension name a visitor cannot read is worse
                than no dimension name. 128px fits all four at 12px; the bar
                flexes into whatever is left, and all four stay on one scale
                because they flex identically. */}
            <span className="w-32 shrink-0 truncate text-[12px] text-faint">
              {PILLAR_LABELS[k].label}
            </span>
            <span className="relative block h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-fg/10">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${SAMPLE_SUBSCORES[k]}%`,
                  background: PILLAR_COLORS[k],
                }}
              />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   HOW IT WORKS — one drawn tile per step.

   These were four identical boxes with a different lucide icon dropped in
   each, which failed the squint test: at a glance the row read as four of the
   same thing, so the tiles carried no meaning the numerals did not already
   carry. Each is now a small DRAWING of its own step — three moments with one
   picked, a line being typed, a ring resolving to a value, two options with
   one kept — so the sequence reads before any of the titles do.

   Deliberately restrained: the real captures sit immediately below in the
   walkthrough, and these must not compete with them.
========================================================================== */

function GlyphFrame({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="relative mb-5 flex h-16 w-full items-center justify-center overflow-hidden rounded-lg border border-line bg-bg/50 px-4"
    >
      {children}
    </span>
  );
}

/** 01 — three repeating moments, one of them picked. */
function GlyphPick() {
  return (
    <GlyphFrame>
      <span className="flex w-full items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-7 flex-1 rounded"
            style={
              i === 1
                ? {
                    border: "1px solid var(--signal)",
                    background:
                      "color-mix(in srgb, var(--signal) 16%, transparent)",
                  }
                : { border: "1px solid var(--border)", opacity: 0.5 }
            }
          />
        ))}
      </span>
    </GlyphFrame>
  );
}

/** 02 — a sentence being typed, cursor still blinking. */
function GlyphWrite() {
  return (
    <GlyphFrame>
      <span className="w-full space-y-1.5">
        <span className="block h-1.5 w-full rounded-full bg-fg/20" />
        <span className="block h-1.5 w-9/12 rounded-full bg-fg/12" />
        <span className="flex items-center gap-1">
          <span className="block h-1.5 w-5/12 rounded-full bg-fg/12" />
          <span className="block h-3 w-px bg-signal" />
        </span>
      </span>
    </GlyphFrame>
  );
}

/** 03 — the score ring resolving. Drawn, not the live ScoreRing: this is a
 *  decorative glyph and must not imply a real value. */
function GlyphScore() {
  return (
    <GlyphFrame>
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r="15"
          stroke="var(--border)"
          strokeWidth="3.5"
        />
        <circle
          cx="20"
          cy="20"
          r="15"
          stroke="var(--signal)"
          strokeWidth="3.5"
          strokeLinecap="round"
          // ~42% of the circumference, matching the illustrative spread
          // used everywhere else on the page.
          strokeDasharray="39.6 54.6"
          transform="rotate(-90 20 20)"
        />
      </svg>
    </GlyphFrame>
  );
}

/** 04 — two readings offered, one kept and one set aside. */
function GlyphDecide() {
  return (
    <GlyphFrame>
      <span className="flex w-full flex-col gap-1.5">
        <span
          className="flex items-center gap-1.5 rounded px-1.5 py-1"
          style={{
            border: "1px solid color-mix(in srgb, var(--signal) 50%, transparent)",
            background: "color-mix(in srgb, var(--signal) 10%, transparent)",
          }}
        >
          <Check className="h-2.5 w-2.5 shrink-0 text-signal" strokeWidth={3} />
          <span className="block h-1 flex-1 rounded-full bg-fg/25" />
        </span>
        <span
          className="flex items-center gap-1.5 rounded border border-line px-1.5 py-1"
          style={{ opacity: 0.4 }}
        >
          <X className="h-2.5 w-2.5 shrink-0 text-faint" strokeWidth={3} />
          <span className="block h-1 flex-1 rounded-full bg-fg/12" />
        </span>
      </span>
    </GlyphFrame>
  );
}

const STEP_GLYPHS = [GlyphPick, GlyphWrite, GlyphScore, GlyphDecide];

export function StepGlyph({ index }: { index: number }) {
  const Glyph = STEP_GLYPHS[index] ?? GlyphPick;
  return <Glyph />;
}
