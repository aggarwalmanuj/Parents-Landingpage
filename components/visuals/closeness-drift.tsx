/* ==========================================================================
   THE DRIFT — the page's opening argument, drawn.

   The claim this section makes is that distance does not arrive in one
   argument; it accumulates across ordinary conversations until it is the
   normal state. That claim is a SHAPE — two lines that leave the same point
   and never cross again — and prose is the worst possible carrier for it.

   Honesty: this is not data and is not drawn as if it were. There are no
   axes, no gridlines, no units, and the caption says plainly that it is a
   recognisable pattern rather than a prediction or a measurement of anyone's
   child. Ages are the ordinary milestones a North American parent recognises,
   not findings.

   Server component. The draw-on animation is CSS only, gated on the Reveal
   wrapper's `is-visible` class so the lines are traced when the section is
   reached rather than finishing silently while it is still off screen.
========================================================================== */

import { Reveal } from "@/components/reveal";

/* Stage x positions are 50 / 150 / 250 / 350 in a 400-wide viewBox, i.e. the
   centres of four equal columns (12.5%, 37.5%, 62.5%, 87.5%). The caption grid
   below uses four equal columns, so dot and caption line up at `sm` and above
   without any measuring. */
const STAGES = [
  { x: 50, y: 63, age: "Age 8", line: "Tells you everything." },
  { x: 150, y: 74, age: "Age 13", line: "The door starts closing." },
  { x: 250, y: 98, age: "Age 17", line: "Fine. Nothing. Later." },
  { x: 350, y: 124, age: "Age 22", line: "You hear it from someone else." },
];

/** The near-flat upper line: you, still reaching. */
const PARENT_PATH = "M 8 62 C 140 58, 240 56, 392 54";
/** The falling lower line: the conversations you actually get. */
const CHILD_PATH = "M 8 62 C 140 60, 210 90, 392 134";
/** Parent forward + child reversed, so the fill IS the gap between them. */
const GAP_PATH =
  "M 8 62 C 140 58, 240 56, 392 54 L 392 134 C 210 90, 140 60, 8 62 Z";

export function ClosenessDrift() {
  return (
    <Reveal as="figure" className="w-full">
      <figcaption className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2.5 text-[12px] uppercase tracking-[0.14em] text-faint">
          <span
            aria-hidden
            className="inline-block h-0 w-6 border-t-2 border-current align-middle"
            style={{ color: "var(--signal)" }}
          />
          How close you still feel
        </span>
        <span className="flex items-center gap-2.5 text-[12px] uppercase tracking-[0.14em] text-faint">
          <span
            aria-hidden
            className="inline-block h-0 w-6 border-t-2 border-dashed border-current align-middle"
          />
          How much they actually tell you
        </span>
      </figcaption>

      <svg
        viewBox="0 0 400 150"
        className="block h-auto w-full"
        role="img"
        aria-label="Two lines leaving the same point in early childhood. The upper line stays level; the lower line falls steadily away through the teenage years, so the gap between them widens with every stage."
        fill="none"
      >
        <defs>
          <linearGradient
            id="drift-gap"
            gradientUnits="userSpaceOnUse"
            x1="8"
            y1="0"
            x2="392"
            y2="0"
          >
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.13" />
          </linearGradient>
        </defs>

        {/* The gap itself, as a widening field. It is the subject of the
            drawing, so it gets area rather than being implied by two strokes. */}
        <path className="drift-fade" d={GAP_PATH} fill="url(#drift-gap)" />

        {/* Stage guides, drawn behind the lines. */}
        {STAGES.map((s) => (
          <line
            key={s.age}
            className="drift-fade"
            x1={s.x}
            y1={s.y}
            x2={s.x}
            y2="146"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}

        <path
          className="drift-draw"
          pathLength={1}
          d={PARENT_PATH}
          stroke="var(--signal)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="drift-draw"
          pathLength={1}
          d={CHILD_PATH}
          stroke="var(--muted-foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
          style={{ ["--drift-delay" as string]: "220ms" }}
        />

        {/* Stage dots on the falling line, where the caption below points. */}
        {STAGES.map((s, i) => (
          <circle
            key={s.age}
            className="drift-fade"
            cx={s.x}
            cy={s.y}
            r="4.5"
            fill="var(--background)"
            stroke="var(--muted-foreground)"
            strokeWidth="2"
            style={{ ["--drift-delay" as string]: `${700 + i * 140}ms` }}
          />
        ))}
      </svg>

      <ul className="mt-5 grid list-none grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        {STAGES.map((s) => (
          <li key={s.age}>
            <p className="text-[12px] uppercase tracking-[0.14em] text-faint">
              {s.age}
            </p>
            <p className="mt-1.5 font-serif-italic text-[17px] leading-snug text-ink">
              {s.line}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-7 text-sm leading-relaxed text-faint">
        A pattern most parents recognise - not a prediction, and not a
        measurement of your child.
      </p>
    </Reveal>
  );
}
