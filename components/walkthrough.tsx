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
import { trackEvent } from "@/lib/analytics";

type Step = {
  n: string;
  title: string;
  meta: string;
  /** A real capture of the live assessment. */
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
    title: "Tell us who this is for",
    meta: "30 seconds",
    img: "/take/parents-00-entry.jpg",
    w: 1920,
    h: 1200,
    alt: "The opening screen of the live assessment: your name, your email, and the four dimensions your score will cover.",
    what: "Your name and the email your result is sent to. A phone number is optional.",
    why: "Your answers are private, and the score is yours to keep. Free, with no credit card.",
  },
  {
    n: "02",
    title: "Answer five honest questions",
    meta: "≈ 7 minutes",
    img: "/take/parents-01-question.jpg",
    w: 1920,
    h: 1200,
    alt: "The first question screen: pick one parenting moment that keeps repeating, and describe the last real time it happened.",
    what: "Five open questions about one moment, typed or spoken in your own words.",
    why: "There is nothing to study and no right answer. Messy answers are genuinely fine.",
  },
  {
    n: "03",
    title: "Watch it reflect back",
    // The five reflections are generated once all five answers are in and are
    // then shown one screen at a time, before the score. They are NOT
    // interleaved between the questions - the funnel's route order is
    // question-1..5 -> processing -> beat-1..5 -> summary - so neither the
    // meta nor the body may imply reflection happens as you answer.
    meta: "Once your answers are in",
    img: "/take/parents-03-reflection.jpg",
    w: 1920,
    h: 1200,
    alt: "A reflection screen reading the parent's own described moment back to them in composed language.",
    what: "Once all five answers are in, they are read back to you in plain language, one reflection at a time.",
    why: "This is where most people feel seen: language for what they already knew but had not named.",
  },
  {
    n: "04",
    title: "Receive your score",
    meta: "Instant",
    img: "/take/parents-04-summary.jpg",
    w: 1920,
    h: 1200,
    alt: "The result screen: a Parenting Belief Score out of 100 with the four dimensions listed beneath it.",
    what: "Your Parenting Belief Score across four dimensions, and the pattern underneath it.",
    why: "A precise, honest score. Not a label, and not an assessment of your child.",
  },
  {
    // Page 1 of a real Parenting Action Plan, from the same completed run as
    // the summary in step 04 - which is why it prints the same 69 and the same
    // four subscores. This is the ONE slide that is letterboxed rather than
    // cropped: it is a document, and a cover-crop would cut the pillar rows
    // that are the reason to show it at all.
    n: "05",
    title: "Go deeper, if you choose",
    meta: "Optional",
    img: "/take/parents-05-plan.jpg",
    w: 1920,
    h: 1200,
    alt: "Page one of a Parenting Action Plan: the score, the pattern named in the parent's own terms, and the four dimensions each with a written reading.",
    what: "A full diagnostic action plan and a personal audio composition, built around your exact answers.",
    why: "The complete picture: what the pattern means, what is in the way, and what shifts when it lifts.",
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
            {/* One line, not two. The standalone four-step "How it works"
                section that used to sit above this was cut in the narrative
                rebuild — these five real screens were always the better
                answer to the same question — so this lede no longer has to
                avoid repeating it. */}
            <p className="text-lg leading-[1.8] text-muted">
              Five questions. One moment. Your score - start to finish, before
              you commit to anything.
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

                {/* Crossfade stack. All four slides are rendered and toggled by
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
                {/* The tablist below is only half a tabs widget on its own:
                    every button announced "tab, selected" while controlling
                    nothing a screen reader could reach, because the stage was
                    an unlabelled <div>. Naming it as the panel the tabs drive
                    (and pointing every tab at it via aria-controls) is what
                    makes selecting a step mean something without sight. One
                    panel rather than five: the slides share a single grid cell
                    and only the selected one is not aria-hidden. */}
                <div
                  id="wt-panel"
                  role="tabpanel"
                  aria-labelledby={`wt-tab-${active}`}
                  className="wt-stage relative w-full bg-surface"
                >
                  {STEPS.map((s, i) => {
                    const hidden = i !== active;
                    // `pointer-events-none` on the inactive slides stops an
                    // invisible one swallowing clicks.
                    const cls = `block w-full transition-opacity duration-700 ${
                      hidden ? "pointer-events-none opacity-0" : "opacity-100"
                    }`;
                    return (
                      <Image
                        key={s.n}
                        src={s.img}
                        alt={s.alt}
                        width={s.w}
                        height={s.h}
                        // `loading="lazy"`, not `priority`.
                        //
                        // The first slide used to be marked `priority`, which
                        // does not mean "load it before the other slides" — it
                        // emits a <link rel=preload fetchpriority=high> in the
                        // document head. This section sits several screens
                        // below the hero, so that preload was pulling a
                        // full-width screenshot (1200w on a phone, once the
                        // device pixel ratio is applied) down the wire at the
                        // highest priority, in parallel with the font and the
                        // JavaScript the hero was still waiting on.
                        //
                        // Lazy is right for all five: the browser starts the
                        // visible slide as the section approaches the viewport,
                        // which is early enough, and the other four cost
                        // nothing until then.
                        loading="lazy"
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
                      aria-controls="wt-panel"
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
