// Simulated assessment screens, rendered from this page's own tokens.
//
// WHY THESE EXIST — read before replacing them with images again.
//
// The walkthrough previously showed two real captures, public/take/question.jpg
// and public/take/beat.jpg, that came from a DIFFERENT vertical of the shared
// assessment. question.jpg asked about "a structural bottleneck", illustrated
// it with two people in business suits, and carried a Grammarly extension icon
// inside the answer box; beat.jpg reflected back a sales moment and told the
// participant "the next step is not 'a call'". On a page asking a parent to
// describe a private family moment, both read as the wrong product. They were
// removed rather than shown (see README, "Assets removed").
//
// A real capture beats a rendered mock — but only when it is a capture of the
// right thing. The parenting question set is not live to capture yet, so these
// two steps are drawn instead, in the product's own visual language, and each
// carries an "Illustrative" chip INSIDE the frame rather than only in a
// caption underneath.
//
// NOTHING NEW IS INVENTED HERE. The prompt text and the typed answer are the
// page's own worked example, already shown verbatim in the mechanism section.
// The reflection body renders as redaction bars, never as an invented
// sentence, for the same reason the report preview does: a reflection cannot
// exist before the parent answers, and writing a plausible one would be
// fabricating somebody's result.
//
// TODO(launch): replace both with real captures from the parenting question
// set once that flow is live. Keep the 16:10 frame so the walkthrough stage
// height does not move.
//
// Server components: no client JS, no image bytes, and they art-direct
// themselves at every width instead of needing a phone capture.

import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";

/** Shared chrome: the five-step progress rail the real screens carry across
 *  the top, plus the illustrative chip. */
function SimShell({
  step,
  children,
}: {
  /** 1-indexed active step of five. */
  step: number;
  children: React.ReactNode;
}) {
  return (
    // 16:10 matches the real captures (1920x1200) so switching between a drawn
    // slide and a photographed one never changes the stage height.
    <div className="relative flex aspect-[16/10] w-full flex-col overflow-hidden bg-bg">
      {/* Progress rail */}
      <div className="flex items-center justify-center gap-1.5 border-b border-line/60 px-4 py-2 sm:gap-2 sm:py-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="block rounded-full"
              style={{
                width: n === step ? 9 : 6,
                height: n === step ? 9 : 6,
                background:
                  n === step
                    ? "var(--ink)"
                    : n < step
                      ? "color-mix(in srgb, var(--ink) 55%, transparent)"
                      : "transparent",
                border:
                  n > step ? "1px solid var(--border-strong)" : "1px solid transparent",
              }}
            />
            {n < 5 && (
              <span className="block h-px w-3 bg-line sm:w-5" aria-hidden />
            )}
          </span>
        ))}
      </div>

      <div className="relative min-h-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>

      {/* The label travels with the artifact, not with the caption beneath it:
          a caption can be cropped out of a screenshot or dropped by a future
          call site, and this frame is a simulation. */}
      <span className="absolute right-2.5 top-2.5 rounded-full border border-line bg-bg/80 px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] text-faint sm:right-3 sm:top-3 sm:text-[8.5px]">
        Illustrative
      </span>
    </div>
  );
}

/** Step 02 — a question screen, mid-answer. */
export function ScreenQuestion() {
  return (
    <SimShell step={2}>
      <div className="flex h-full min-h-0 flex-col">
        <p className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-faint sm:text-[10px]">
          <span className="inline-block h-px w-4 bg-line-strong sm:w-6" aria-hidden />
          Question 1 · 5
        </p>
        {/* Scales with the frame rather than the page: this is product chrome
            inside a simulated screenshot, where small type is the point. */}
        <p className="mt-1.5 font-serif text-[13px] leading-[1.2] text-ink sm:mt-3 sm:text-[20px] lg:text-[26px]">
          Think of one moment that keeps repeating.
          <span className="block font-serif-italic">What happened?</span>
        </p>
        <p className="mt-1.5 hidden text-[10px] leading-[1.6] text-faint sm:mt-3 sm:block lg:text-[12px]">
          In your own words. There is no right answer, nothing to prepare, and
          messy is fine.
        </p>

        {/* The answer box, mid-typing. The quoted sentence is the page's own
            worked example, so the walkthrough and the mechanism section show
            the same parent describing the same moment. */}
        <div
          className="mt-2 min-h-0 flex-1 rounded-md border px-2.5 py-2 sm:mt-4 sm:px-3.5 sm:py-3"
          style={{
            borderColor: "color-mix(in srgb, var(--signal) 45%, transparent)",
            background: "color-mix(in srgb, var(--signal) 5%, transparent)",
          }}
        >
          <p className="font-serif-italic text-[10px] leading-[1.5] text-ink sm:text-[13px] lg:text-[15px]">
            &ldquo;I had already reminded them twice. I was about to ask again
            because I couldn&rsquo;t stop thinking about what might happen if
            they forgot.
            <span
              className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-signal"
              aria-hidden
            />
          </p>
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between gap-3 sm:mt-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-faint sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[9.5px]">
            <ArrowLeft className="h-2.5 w-2.5" aria-hidden /> Back
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[8px] uppercase tracking-[0.14em] sm:gap-1.5 sm:px-5 sm:py-1.5 sm:text-[9.5px]"
            style={{ background: "var(--signal)", color: "var(--background)" }}
          >
            Continue <ArrowRight className="h-2.5 w-2.5" aria-hidden />
          </span>
        </div>
      </div>
    </SimShell>
  );
}

/** Step 03 — the reflection between questions. */
export function ScreenReflection() {
  return (
    <SimShell step={3}>
      <div className="flex h-full min-h-0 flex-col">
        <p className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-faint sm:text-[10px]">
          <span className="inline-block h-px w-4 bg-line-strong sm:w-6" aria-hidden />
          Reflection 3 · 5
        </p>

        <div className="mt-2 min-h-0 flex-1 rounded-lg border border-line bg-card p-3 sm:mt-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-faint sm:text-[9.5px]">
            <Lightbulb className="h-2.5 w-2.5 text-signal sm:h-3 sm:w-3" aria-hidden />
            What you have described so far
          </p>
          <p className="mt-1.5 font-serif text-[12px] leading-[1.25] text-ink sm:mt-3 sm:text-[17px] lg:text-[21px]">
            The same moment has come back
            <span className="block font-serif-italic">more than once.</span>
          </p>
          {/* Redaction bars, not invented prose: the reflection is built from
              the parent's own answers and cannot exist before they write. */}
          <div className="mt-2 space-y-1.5 sm:mt-4 sm:space-y-2" aria-hidden>
            <span className="block h-1 rounded-full bg-fg/20 sm:h-1.5" />
            <span className="block h-1 w-10/12 rounded-full bg-fg/12 sm:h-1.5" />
            <span className="block h-1 w-11/12 rounded-full bg-fg/8 sm:h-1.5" />
            <span className="block h-1 w-6/12 rounded-full bg-fg/8 sm:h-1.5" />
          </div>
        </div>

        <p className="mt-2 shrink-0 text-[8.5px] leading-relaxed text-faint sm:mt-3 sm:text-[11px]">
          Nothing here is a conclusion. You decide what fits.
        </p>
      </div>
    </SimShell>
  );
}
