"use client";

// Walkthrough — "see the whole assessment before you begin", adapted from the
// scorecard-funnel landing's walkthrough section.
//
// Why it earns its place on a parenting page: the visitor is being asked to
// describe a private family moment to a stranger's website. The ask has no
// visible shape until they can see what they will actually be doing. Showing
// the real screens converts an uncertain commitment into a known one.
//
// Motion intent: a story-style auto-advance carries a passive visitor through
// every step without a click — the important thing is that they SEE the arc.
// Fully pausable (WCAG 2.2.2), pauses on hover/focus so it never fights the
// reader, and defaults to paused under prefers-reduced-motion and on touch
// (where the pause-on-hover guard can never fire).
//
// The screenshots are the shared AI Merge assessment interface, so they show
// the real flow. TODO(launch): re-capture with the parenting question set once
// that flow is live, so the copy on screen matches the copy on this page.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionViewTracker } from "@/components/section-view-tracker";
import { trackEvent } from "@/lib/analytics";

type Step = {
  n: string;
  title: string;
  meta: string;
  img: string;
  w: number;
  h: number;
  alt: string;
  what: string;
  why: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    n: "01",
    title: "Choose one moment",
    meta: "A minute",
    img: "/take/audience.png",
    w: 1880,
    h: 932,
    alt: "The opening screen of the assessment, where you say who the reflection is for and where your result should be sent.",
    what: "A recurring interaction, request, or decision you want to understand.",
    why: "One moment, described concretely, is what the score is built from. Not your whole relationship.",
  },
  {
    n: "02",
    title: "Describe what happens",
    meta: "Five questions",
    img: "/take/question.png",
    w: 1888,
    h: 906,
    alt: "A question screen showing a single open question with room to type your answer in your own words.",
    what: "Five short questions, in your own words. No polished explanation required.",
    why: "There is no right answer and nothing to study. You are describing what actually happened.",
  },
  {
    n: "03",
    title: "See it reflected back",
    meta: "As you go",
    img: "/take/beat.png",
    w: 1879,
    h: 891,
    alt: "A reflection screen where the assessment mirrors back what you have just described.",
    what: "Between questions, what you have described is reflected back to you in plain language.",
    why: "This is usually where the pattern first becomes visible — named, rather than merely felt.",
  },
  {
    n: "04",
    title: "Receive your score",
    meta: "Immediately",
    img: "/take/reportsummary.png",
    w: 1893,
    h: 848,
    alt: "The result screen showing the Parenting Belief Score summary with the pattern reflected back.",
    what: "What happened, what it meant, your response, the loop, and the moment to notice.",
    why: "Free, with no credit card and no waiting. Your result is yours to keep.",
  },
  {
    n: "05",
    title: "Decide what fits",
    meta: "Optional",
    img: "/take/reportpdf.png",
    w: 957,
    h: 896,
    alt: "The expanded breakdown, an optional detailed document available after the free score.",
    what: "An optional detailed breakdown and personalised Action Plan, if you want to go further.",
    why: "You are never required to buy anything to get your score. You remain the authority on what fits.",
  },
];

const ADVANCE_MS = 6500;

export function WalkthroughSection() {
  const [active, setActive] = useState(0);
  const [userPlaying, setUserPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(true);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Start auto-advance after mount unless the visitor prefers reduced motion,
  // or is on a touch device (where pause-on-hover never fires, so autoplay
  // would yank the slide away mid-read). Done in an effect so SSR output stays
  // deterministic and the OS setting is honoured.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverless = window.matchMedia("(hover: none)");
    setReduced(mq.matches);
    setUserPlaying(!mq.matches && !hoverless.matches);
    const onChange = (e: MediaQueryListEvent) => {
      setReduced(e.matches);
      setUserPlaying(!e.matches && !hoverless.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const running = userPlaying && !interacting;

  // Depending on `active` restarts the timer whenever the step changes
  // (including manual selection), so every step gets its full dwell time.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % STEPS.length),
      ADVANCE_MS
    );
    return () => window.clearTimeout(id);
  }, [running, active]);

  // Auto-advance must NOT steal focus; keyboard/click selection should.
  const select = useCallback((index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }, []);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const last = STEPS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  };

  const current = STEPS[active];

  return (
    <section
      id="walkthrough"
      className="border-t border-line py-16 sm:py-24 lg:py-28"
      aria-labelledby="walkthrough-heading"
    >
      <SectionViewTracker event="walkthrough_view" />
      <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
        {/* Chapter head */}
        <Reveal as="div" className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">VII · The walkthrough</p>
            <h2 id="walkthrough-heading" className="text-section">
              See the whole thing
              <span className="block font-serif-italic">before you begin.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg leading-[1.8] text-muted">
              Five questions. One moment. Your result.
            </p>
            <p className="mt-3 text-[15px] leading-[1.75] text-faint">
              Here is every step, start to finish — so you know exactly what
              you&rsquo;re walking into, and what you&rsquo;ll walk away with.
            </p>
          </div>
        </Reveal>

        <Reveal as="div" delay={150} className="my-12 sm:my-16">
          <div className="hairline-anim hairline" />
        </Reveal>

        <Reveal as="div" delay={150}>
          <div
            className="grid gap-10 lg:grid-cols-12 lg:gap-14"
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocusCapture={() => setInteracting(true)}
            onBlurCapture={() => setInteracting(false)}
          >
            {/* Stage — browser-framed screenshot with story segments. */}
            <div className="lg:col-span-7">
              <div className="mac-window relative">
                <div className="mac-bar">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="mac-dot" />
                    <span className="mac-dot" />
                    <span className="mac-dot" />
                  </span>
                  <span
                    className="ml-1 hidden truncate rounded-full bg-bg/60 px-3 py-1 text-[11px] tracking-wide text-faint sm:inline-block"
                    aria-hidden
                  >
                    aimerge.live / your-score
                  </span>
                  {/* Story-style progress segments. aria-hidden because the
                      real, labelled controls are the step list below; these
                      would otherwise duplicate every step for a screen
                      reader. */}
                  <div className="ml-auto flex items-center gap-1.5" aria-hidden>
                    {STEPS.map((s, i) => (
                      <button
                        key={s.n}
                        type="button"
                        tabIndex={-1}
                        onClick={() => select(i)}
                        className="relative h-1 w-6 overflow-hidden rounded-full bg-line sm:w-8"
                      >
                        <span
                          className={`wt-seg-bar absolute inset-0 rounded-full bg-signal ${
                            i < active ? "wt-seg-done" : ""
                          } ${i === active && running ? "wt-seg-fill" : ""}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crossfade stack. All five slides are rendered and toggled by
                    opacity so switching never shows a blank frame while the
                    next file decodes.

                    The stage is a GRID with every slide in the same cell
                    (.wt-stage), not `aspect-[16/9]` + `object-cover`. That
                    combination cropped every capture to a fixed 16:9 window:
                    fine for the three wide screens, destructive for the
                    near-square breakdown page (957x896), which lost roughly a
                    third of its content — including the pillar rows that make
                    it worth showing. Letting the stage take the height of the
                    captures shows each one whole, and the fixed cell means
                    switching between different native ratios still never
                    reflows the page. */}
                <div className="wt-stage relative w-full bg-surface">
                  {STEPS.map((s, i) => (
                    <Image
                      key={s.n}
                      src={s.img}
                      alt={s.alt}
                      width={s.w}
                      height={s.h}
                      // Only the first slide is eager: it is the one visible
                      // when the section scrolls in.
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className={`block h-auto w-full transition-opacity duration-700 ${
                        i === active ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                      aria-hidden={i !== active}
                    />
                  ))}
                  <span aria-hidden className="wt-vignette absolute inset-0" />
                </div>
              </div>

              {/* Caption + play control under the frame. */}
              <div className="mt-4 flex items-start justify-between gap-4">
                <p
                  className="text-[14.5px] leading-[1.7] text-faint"
                  aria-live="polite"
                >
                  <span className="text-ink">{current.what}</span>{" "}
                  {current.why}
                </p>
                {/* WCAG 2.2.2: any auto-updating content needs a pause
                    control. Hidden when reduced motion already stopped it. */}
                {!reduced && (
                  <button
                    type="button"
                    onClick={() => setUserPlaying((p) => !p)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-ink"
                  >
                    {userPlaying ? (
                      <>
                        <Pause className="h-3 w-3" aria-hidden /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" aria-hidden /> Play
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Step list — the real, labelled tablist. */}
            <div className="lg:col-span-5">
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label="Assessment steps"
                onKeyDown={onTabKeyDown}
              >
                {STEPS.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={s.n}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`wt-tab-${i}`}
                      aria-selected={isActive}
                      // Roving tabindex: one stop for the whole list, arrows
                      // move between steps.
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        select(i);
                        trackEvent("walkthrough_step", { step: s.n });
                      }}
                      className={`row-interactive grid w-full grid-cols-12 items-baseline gap-4 border-t border-line py-5 text-left last:border-b ${
                        isActive ? "" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span
                        className={`row-num col-span-2 font-serif text-2xl ${
                          isActive ? "text-signal" : "text-faint"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span className="col-span-10">
                        <span className="flex items-baseline gap-3">
                          <span className="row-mark" aria-hidden />
                          <span className="text-title">{s.title}</span>
                        </span>
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-faint">
                          {s.meta}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
