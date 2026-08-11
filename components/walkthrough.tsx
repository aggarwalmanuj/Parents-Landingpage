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
// Three steps are real captures of the shared AI Merge assessment interface.
// Two are NOT, deliberately: steps 02 and 03 used to be public/take/question.jpg
// and public/take/beat.jpg, which came from the business vertical of the same
// assessment — a question about "a structural bottleneck" illustrated with two
// people in suits, and a reflection telling the participant "the next step is
// not 'a call'". Shown to a parent about to describe a family moment, they read
// as a different product entirely, so they were removed and replaced with drawn
// screens in the product's own language (components/visuals/sim-screens.tsx).
//
// TODO(launch): re-capture ALL five with the parenting question set once that
// flow is live, and swap the two drawn steps back to <Image>.

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Pause, Play } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionViewTracker } from "@/components/section-view-tracker";
import { ScreenQuestion, ScreenReflection } from "@/components/visuals/sim-screens";
import { trackEvent } from "@/lib/analytics";

type Step = {
  n: string;
  title: string;
  meta: string;
  /** A real capture. Mutually exclusive with `render`. */
  img?: string;
  w?: number;
  h?: number;
  /** A drawn screen, for steps whose real capture is off-vertical. */
  render?: () => React.ReactNode;
  alt: string;
  what: string;
  why: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    n: "01",
    title: "Choose one moment",
    meta: "A minute",
    img: "/take/audience.jpg",
    w: 1920,
    h: 1200,
    alt: "The opening screen of the assessment, where you say who the reflection is for and where your result should be sent.",
    what: "A recurring interaction, request, or decision you want to understand.",
    why: "One moment, described concretely, is what the score is built from. Not your whole relationship.",
  },
  {
    n: "02",
    title: "Describe what happens",
    meta: "Five questions",
    render: ScreenQuestion,
    alt: "A question screen showing a single open question with room to type your answer in your own words.",
    what: "Five short questions, in your own words. No polished explanation required.",
    why: "There is no right answer and nothing to study. You are describing what actually happened.",
  },
  {
    n: "03",
    title: "See it reflected back",
    meta: "As you go",
    render: ScreenReflection,
    alt: "A reflection screen where the assessment mirrors back what you have just described.",
    what: "Between questions, what you have described is reflected back to you in plain language.",
    why: "This is usually where the pattern first becomes visible - named, rather than merely felt.",
  },
  {
    n: "04",
    title: "Receive your score",
    meta: "Immediately",
    img: "/take/reportsummary.jpg",
    w: 1920,
    h: 1200,
    alt: "The result screen showing the Parenting Belief Score summary with the pattern reflected back.",
    what: "What happened, what it meant, your response, the loop, and the moment to notice.",
    why: "Free, with no credit card and no waiting. Your result is yours to keep.",
  },
  {
    n: "05",
    title: "Decide what fits",
    meta: "Optional",
    img: "/take/reportpdf.jpg",
    w: 1920,
    h: 1200,
    alt: "The expanded breakdown, an optional detailed document available after the free score.",
    what: "An optional detailed breakdown and personalised Action Plan, if you want to go further.",
    why: "You are never required to buy anything to get your score. You remain the authority on what fits.",
  },
];

const ADVANCE_MS = 6500;

/**
 * Read a media query as React state.
 *
 * useSyncExternalStore rather than useState + useEffect. The effect version
 * called setState synchronously in the effect body on every mount, which is a
 * cascading render (and what react-hooks/set-state-in-effect flags). This
 * subscribes to the MediaQueryList directly instead, which is exactly what the
 * hook is for.
 *
 * The server snapshot returns `true` for both queries this component uses, so
 * SSR emits the paused, reduced-motion state — the safe default, and the same
 * markup the previous implementation produced. The real values arrive on
 * hydration.
 */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true
  );
}

export function WalkthroughSection() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Touch devices: pause-on-hover can never fire there, so autoplay would yank
  // the slide away mid-read.
  const hoverless = useMediaQuery("(hover: none)");

  // `null` means the visitor has not touched the control, so the media queries
  // decide. Deriving it this way (rather than syncing state in an effect) means
  // a system setting that changes mid-session is honoured immediately, and an
  // explicit choice is never silently overwritten by that change.
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const userPlaying = userOverride ?? (!reduced && !hoverless);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
              Here is every step, start to finish - so you know exactly what
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
                  {/* Story-style progress segments.

                      Spans, not buttons. They are aria-hidden (the real,
                      labelled control is the step tablist below, and these
                      would duplicate every step for a screen reader) and they
                      were also only 4px tall — a click target a tenth of the
                      44px floor, which nobody aims at on purpose and which
                      every accessibility sweep flags. Removing the interaction
                      is the right fix rather than inflating a decorative bar:
                      the tablist beside it already selects any step. */}
                  <div className="ml-auto flex items-center gap-1.5" aria-hidden>
                    {STEPS.map((s, i) => (
                      <span
                        key={s.n}
                        className="relative block h-1 w-6 overflow-hidden rounded-full bg-line sm:w-8"
                      >
                        <span
                          className={`wt-seg-bar absolute inset-0 rounded-full bg-signal ${
                            i < active ? "wt-seg-done" : ""
                          } ${i === active && running ? "wt-seg-fill" : ""}`}
                        />
                      </span>
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
                  {STEPS.map((s, i) => {
                    const hidden = i !== active;
                    // One shared wrapper for both slide kinds, so a drawn
                    // screen and a captured one crossfade identically and both
                    // occupy the same grid cell. `pointer-events-none` on the
                    // inactive ones stops an invisible slide swallowing clicks.
                    const cls = `block w-full transition-opacity duration-700 ${
                      hidden ? "pointer-events-none opacity-0" : "opacity-100"
                    }`;
                    if (s.render) {
                      const Slide = s.render;
                      return (
                        <div
                          key={s.n}
                          className={cls}
                          aria-hidden={hidden}
                          role="img"
                          aria-label={s.alt}
                        >
                          <Slide />
                        </div>
                      );
                    }
                    return (
                      <Image
                        key={s.n}
                        src={s.img as string}
                        alt={s.alt}
                        width={s.w as number}
                        height={s.h as number}
                        // Only the first slide is eager: it is the one visible
                        // when the section scrolls in.
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className={`${cls} h-auto`}
                        aria-hidden={hidden}
                      />
                    );
                  })}
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
                    onClick={() => setUserOverride(!userPlaying)}
                    // min-h-11 = 44px, the tap-target floor. Was 34px tall.
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border border-line px-3 py-1.5 text-[12px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
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
                        <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-faint">
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
