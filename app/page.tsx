import Image from "next/image";
import ReactDOM from "react-dom";
import { FaqItem } from "@/components/faq-item";
import { LandingAnalytics } from "@/components/landing-analytics";
import { MacWindow } from "@/components/mac-window";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { MagneticButton, WordReveal } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { ScorecardCta } from "@/components/scorecard-cta";
import { SectionViewTracker } from "@/components/section-view-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  PageStructuredData,
  howToNode,
  publicationNode,
  videoNode,
} from "@/components/structured-data";
import { VslPlayer } from "@/components/vsl-player";
import { WalkthroughSection } from "@/components/walkthrough";
import { ZoomableShot } from "@/components/zoomable-shot";
import type { CtaLocation } from "@/lib/analytics";
import { ESSENTIAL_FAQS, toFaqEntries } from "@/lib/faq";
import { ROUTES } from "@/lib/site";

/* ==========================================================================
   AI Merge · Free Parenting Belief Score doorway page.

   DESIGN
   The hero (eyebrow → headline → VSL → CTA → trust line) follows the
   Coaches and Consultants landing page, per instruction: same Marine system
   (deep navy ground, one teal --signal accent, Fraunces display + Inter).
   Every section BELOW the hero follows the scorecard-funnel landing's
   editorial grammar instead: a roman-numeral chapter mark, a Fraunces
   headline whose second clause drops to italic, an animated hairline, then
   the content. Utilities for that grammar live at the end of globals.css.

   CONTENT
   Copy is the approved Parents document, block by block. Nothing is carried
   over from the coaches vertical.

   REGISTER (from the document)
   - The free "Parenting Belief Score" is the ONLY offer. One CTA everywhere.
   - It examines THE PARENT'S pattern, never the child's. No section may
     assess, score, diagnose, or infer the state of a child.
   - It is educational and reflective — not diagnosis, treatment, or medical,
     psychological, legal, or family-therapy services.
   - Belief is never the sole cause. Development, circumstances, personality,
     health, finances, history and culture stay explicitly real.
   - AI is supporting technology, not the authority. The participant decides.
   - No urgency, no scarcity, no promised child outcome.
   - Completion time is published as "About 10 minutes" — the measured figure
     confirmed by the owners, replacing the document's [VERIFIED TIME] slot.
   - "TODO(launch)" markers keep the document's unresolved items honest
     instead of quietly filling them in.
========================================================================== */

/* Block 04: how a described moment becomes the five result fields. The
   document's worked example, verbatim. `reveal` marks the one field the free
   result withholds. */
const SCORE_FIELDS = [
  {
    label: "What happened",
    body: "A responsibility still felt unfinished.",
  },
  {
    label: "What it meant",
    body: "Not stepping in started to feel risky.",
  },
  {
    label: "Your response",
    body: "Another reminder felt necessary.",
  },
  {
    label: "Possible belief",
    body: "Revealed only in your completed personalised result.",
    reveal: true,
  },
  {
    label: "The loop",
    body: "Concern drives intervention. Intervention hides what would have happened without it. The missing evidence feeds the concern again.",
  },
  {
    label: "Moment to notice",
    body: "The instant uncertainty becomes a reason to act, before checking what the facts actually support.",
  },
];

/* Block 06: what a completed result contains. */
const WHATS_INSIDE = [
  "The moment that keeps repeating.",
  "What it begins to mean to you — before you’ve consciously decided.",
  "The point where you may have more choice than it feels like.",
];

/* Block 11: the four process steps. */
const HOW_IT_WORKS = [
  {
    title: "Choose one moment.",
    body: "A recurring interaction, request, or decision you want to understand.",
  },
  {
    title: "Describe what happens.",
    body: "Five short questions, in your own words.",
  },
  {
    title: "Receive your score.",
    body: "Built from the information you provide about your own experience.",
  },
  {
    title: "Decide what fits.",
    body: "Keep what feels accurate. Question what doesn’t. You remain the authority.",
  },
];

/* Block 09: prior professional work behind AI Merge. Pedigree, NOT
   endorsement — the disclaimer under the row states this, and the document
   makes it mandatory if the strip is kept at all.

   The document flags this whole block as a CRO A/B test ("present vs.
   removed", hypothesis neutral-to-negative for a parenting audience, with
   implied-endorsement risk on Meta). Flip SHOW_LOGO_STRIP to false to ship
   the removed arm. */
const SHOW_LOGO_STRIP = true;
const TRUST_LOGOS = [
  { src: "/logos/ibm.png", alt: "IBM" },
  { src: "/logos/microsoft.png", alt: "Microsoft" },
  { src: "/logos/tmobile.png", alt: "T-Mobile" },
  { src: "/logos/pearson.png", alt: "Pearson" },
  { src: "/logos/un.png", alt: "United Nations" },
];

/* Zone A microcopy. The document specifies this line under every primary CTA.
   The document shipped a [VERIFIED TIME] placeholder here; the measured figure
   is ten minutes, confirmed by the owners, so it is now stated plainly. */
const CTA_MICROCOPY = "Free · 5 questions · About 10 minutes · No credit card";

const CTA_LABEL = "Get My Free Parenting Belief Score";
const CTA_LABEL_SHORT = "Get My Free Score";

/** Primary CTA + the reassurance line beneath it. Short label on phones, full
 *  label from `sm` up, so the pill never overflows a 320px viewport. */
function CtaBlock({
  location,
  microcopy = CTA_MICROCOPY,
  className = "",
}: {
  location: CtaLocation;
  microcopy?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Wrapper hosts the ambient light behind the button, see .cta-halo. */}
      <span className="cta-halo w-full sm:w-auto">
        <ScorecardCta
          variant="signal"
          size="lg"
          location={location}
          className="w-full min-h-11 sm:w-auto"
        >
          <span className="sm:hidden">{CTA_LABEL_SHORT}</span>
          <span className="hidden sm:inline">{CTA_LABEL}</span>
        </ScorecardCta>
      </span>
      {/* px-2 + balance: at 390px the four dot-separated clauses ran the full
          width and broke against the viewport edge. Balancing splits them into
          two even lines instead of three ragged ones. */}
      <p className="text-balance px-2 text-center text-sm text-faint">
        {microcopy}
      </p>
    </div>
  );
}

/** Chapter head shared by every section below the hero: roman-numeral mark,
 *  a two-clause Fraunces headline, and an optional lede in the right column. */
function ChapterHead({
  mark,
  id,
  lead,
  emphasis,
  children,
  pulse = false,
}: {
  mark: string;
  id?: string;
  /** First clause, upright. */
  lead: string;
  /** Second clause, italic, on its own line. */
  emphasis?: string;
  /** Right-column lede. */
  children?: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <Reveal as="div" className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <p className="eyebrow mb-6">
          {pulse && <span className="pulse-dot mr-2.5" aria-hidden />}
          {mark}
        </p>
        {/* The two clauses are separate block spans rather than raw text
            plus a span: without the wrapper, `lead` and `emphasis` concatenate
            with no whitespace in the accessible name and in any text
            extraction ("What happens inside youbetween noticing"), even though
            the visual line break made it look correct. */}
        <h2 id={id} className="text-section">
          <span className="block">{lead}</span>
          {emphasis && <span className="block font-serif-italic">{emphasis}</span>}
        </h2>
      </div>
      {children && <div className="lg:col-span-5">{children}</div>}
    </Reveal>
  );
}

/** The animated rule that separates a chapter head from its content. */
function ChapterRule({ className = "my-12 sm:my-16" }: { className?: string }) {
  return (
    <Reveal as="div" delay={150} className={className}>
      <div className="hairline-anim hairline" />
    </Reveal>
  );
}

/**
 * Asset placeholder. The document specifies several images that do not exist
 * yet and explicitly forbids inventing them (the participant-proof block in
 * particular: "Do not invent"). Rather than ship a stock photo that
 * contradicts the page's own rules, each slot renders as a labelled,
 * production-ready brief carrying the document's priority, constraints, and
 * dimensions — so the gap is visible to the team and honest to a visitor.
 */
function AssetSlot({
  priority,
  title,
  spec,
  children,
  aspect = "aspect-[4/3]",
}: {
  priority: string;
  title: string;
  /** Dimensions / format line. */
  spec: string;
  /** The production brief. */
  children: React.ReactNode;
  aspect?: string;
}) {
  return (
    <figure
      className={`flex w-full flex-col justify-center rounded-xl border border-dashed border-line-strong bg-surface/60 p-6 text-left sm:p-8 ${aspect}`}
    >
      <figcaption className="eyebrow mb-4 text-signal">{priority}</figcaption>
      <p className="text-title">{title}</p>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-faint">
        {children}
      </div>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        {spec}
      </p>
    </figure>
  );
}

export default function Home() {
  // LCP preload. The hero video's poster is the largest element in the initial
  // viewport on desktop, but a `poster` attribute is only discovered once the
  // <video> is parsed and browsers fetch posters at low priority — so it loses
  // the race to assets that matter less. ReactDOM.preload (not a rendered
  // <link>) emits exactly one hint rather than two.
  ReactDOM.preload("/video/vsl-parents-poster.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <>
      <SiteHeader />
      {/* FAQ, video, HowTo and publication JSON-LD: homepage only, because only
          this page renders the questions accordion, the VSL, and the four-step
          process they describe. The FAQ entities are generated from the same
          lib/faq.ts array the accordion renders, so markup and visible copy
          cannot drift apart. */}
      <PageStructuredData
        name="Free Parenting Belief Score"
        path={ROUTES.home.path}
        description="See what may be shaping your response before the next conversation. A free, personalised Parenting Belief Score built from your own words. Reflective and educational, not a diagnosis, and not an assessment of your child."
        updated={ROUTES.home.updated}
        faqs={toFaqEntries(ESSENTIAL_FAQS)}
        speakableSelectors={["#hero-headline", "#whats-inside-heading"]}
        extraNodes={[videoNode, howToNode, publicationNode]}
      />
      <LandingAnalytics />

      <main id="main" className="relative flex-1">
        {/* ================== Block 01 · Hero ==================
            Structure mirrors the Coaches and Consultants hero exactly:
            eyebrow, headline, VSL, CTA, trust line, credibility line. No
            supporting paragraph between the headline, the VSL and the CTA. */}
        <section id="hero" className="relative overflow-hidden">
          {/* Tighter top/bottom on phones. The hero stacks eyebrow, a
              four-line headline, a three-line subhead and a 16:9 video before
              the CTA is reached; at the desktop rhythm that pushed the button
              well past a second screen on a 390px viewport. */}
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-7 pt-8 text-center sm:px-8 sm:pb-10 sm:pt-16">
            <Reveal>
              <p className="cred-chip">
                AI Merge · Free Parenting Belief Score
              </p>
            </Reveal>
            <Reveal delay={80}>
              {/* The document's H1 and subhead. The italic clause carries the
                  promise ("before the next conversation"), which is the whole
                  proposition: this is about the moment that has not happened
                  yet, not the one that already went wrong. */}
              <h1 id="hero-headline" className="text-display mt-6 sm:mt-8">
                See what&rsquo;s shaping your response{" "}
                <span className="text-emphasis">
                  before the next conversation.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-2xl text-balance text-body-lg text-muted sm:mt-6">
                Answer five questions about one real parenting moment. Get a
                free, personalised Parenting Belief Score built from your own
                words.
              </p>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal immediate>
              <VslPlayer />
            </Reveal>
            <Reveal delay={220}>
              <CtaBlock location="hero" className="mt-8" />
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-4 text-center text-sm leading-relaxed text-faint">
                A quiet week. An unfinished responsibility. Another reminder. A
                decision you wouldn&rsquo;t have made. The moment may be small.
                What it begins to mean can become much larger.
              </p>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <p className="mx-auto mt-8 max-w-4xl px-5 pb-16 text-center text-sm text-faint sm:px-8">
              Built on AI Merge, a methodology published in the{" "}
              <span className="text-muted">Mensa Research Journal</span>.
            </p>
          </Reveal>
        </section>

        {/* ============ Block 03 · The one additional question ============
            The page's hinge. Two objections are granted as true, then the
            question is narrowed to the parent's own pattern. Everything after
            this section depends on the reader having accepted this framing. */}
        <section
          className="border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="question-heading"
        >
          <SectionViewTracker event="question_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="I · The question"
              id="question-heading"
              lead="What happens inside you"
              emphasis="between noticing and deciding?"
            >
              <p className="text-lg leading-[1.8] text-muted">
                The Parenting Belief Score isn&rsquo;t asking you to ignore
                what&rsquo;s real, or to accept that you&rsquo;re doing anything
                wrong. It asks one additional question — the one to the left.
              </p>
              <p className="mt-4 font-serif-italic text-xl text-ink">
                It examines your pattern, not your child&rsquo;s.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* The two objections, granted rather than argued with. */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              <Reveal as="div" delay={150}>
                <blockquote className="h-full rounded-xl border border-line bg-bg p-6 sm:p-8">
                  <p className="text-title">
                    &ldquo;But the situation with my child is real.&rdquo;
                  </p>
                  <p className="mt-4 leading-[1.8] text-muted">
                    That may be true. Your child may genuinely be facing a
                    decision with real consequences.
                  </p>
                </blockquote>
              </Reveal>
              <Reveal as="div" delay={250}>
                <blockquote className="h-full rounded-xl border border-line bg-bg p-6 sm:p-8">
                  <p className="text-title">
                    &ldquo;I&rsquo;m not trying to control anything. I just want
                    to stay close.&rdquo;
                  </p>
                  <p className="mt-4 leading-[1.8] text-muted">
                    That may also be true.
                  </p>
                </blockquote>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <CtaBlock location="question" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ========= Block 04 · How your words become your score =========
            The page's central proof. A described moment on the left, the
            result fields it produces on the right. */}
        <section
          className="border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="score-heading"
        >
          <SectionViewTracker event="score_visual_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="II · The mechanism"
              id="score-heading"
              lead="How your words"
              emphasis="become your score."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Describe one real moment. No polished explanation required.
                Your score reflects the pattern back, then you receive your
                personalised result immediately — no credit card, no waiting.
              </p>
            </ChapterHead>

            <ChapterRule />

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              {/* What the parent writes. */}
              <Reveal as="div" delay={150} className="lg:col-span-5">
                <p className="eyebrow mb-5">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  What you write
                </p>
                <blockquote className="rounded-xl border border-line bg-surface p-6 sm:p-8">
                  <p className="font-serif-italic text-xl leading-[1.6] text-ink sm:text-2xl">
                    &ldquo;I had already reminded them twice. I was about to ask
                    again because I couldn&rsquo;t stop thinking about what
                    might happen if they forgot.&rdquo;
                  </p>
                </blockquote>
                <p className="mt-5 text-sm leading-relaxed text-faint">
                  Messy answers are allowed. There is no perfect wording, and
                  nothing to prepare.
                </p>

                {/* The document's highest-priority asset: "the actual score
                    display exactly as the live product renders it. Not a
                    mockup, not an illustration."

                    This is a real capture of the live AI Merge result screen,
                    so it satisfies the "not a mockup" rule today rather than
                    leaving the page's central proof empty. It is the shared
                    assessment interface. TODO(launch): re-capture from the
                    parenting question set so the words on screen match the
                    words on this page. */}
                {/* Zoomable: at this width the UI inside the capture is far
                    below reading size, and an unreadable proof is decoration.
                    Tapping opens it full-viewport. */}
                <ZoomableShot
                  className="mt-8"
                  src="/take/reportsummary.png"
                  alt="The live result screen, showing a completed score with the pattern reflected back to the participant."
                  width={1893}
                  height={848}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  caption="The live result screen"
                  event="result_screen"
                />
              </Reveal>

              {/* What the score returns. */}
              <Reveal as="div" delay={250} className="lg:col-span-7">
                <p className="eyebrow mb-5">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  What your score reflects back
                </p>
                <MacWindow title="your-parenting-belief-score">
                  <dl className="divide-y divide-line">
                    {SCORE_FIELDS.map((f) => (
                      <div
                        key={f.label}
                        className="grid grid-cols-12 gap-4 px-5 py-5 sm:px-7 sm:py-6"
                      >
                        <dt className="col-span-12 text-[11px] uppercase tracking-[0.18em] text-faint sm:col-span-4">
                          {f.label}
                        </dt>
                        <dd
                          className={`col-span-12 leading-[1.7] sm:col-span-8 ${
                            f.reveal
                              ? "font-serif-italic text-signal"
                              : "text-muted"
                          }`}
                        >
                          {f.body}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </MacWindow>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-faint">
                  Illustrative example. Yours will be built from your own words.
                </p>

                <Reveal delay={150}>
                  <CtaBlock location="score_visual" className="mt-10" />
                </Reveal>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ====== Block 05 · Patterns become visible in ordinary moments ====== */}
        <section
          className="border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="recognition-heading"
        >
          <SectionViewTracker event="recognition_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="III · Recognition"
              id="recognition-heading"
              lead="Patterns become visible"
              emphasis="in ordinary moments."
            >
              <p className="text-lg leading-[1.8] text-muted">
                A week goes by without much being said. A report card arrives. A
                move gets closer. Another request arrives, and you hear yourself
                asking the same question again.
              </p>
            </ChapterHead>

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal as="div" delay={150} className="lg:col-span-7">
                {/* The four questions, set as the page's one quiet crescendo. */}
                {/* Two-up from the smallest width. These are four short
                    questions, not four statements: stacking them one per row on
                    a phone pushed the paragraph that answers them a full screen
                    down, which broke the beat the copy depends on. */}
                <ul className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    "Will they be okay?",
                    "Am I doing enough?",
                    "Should I step in?",
                    "What happens if I don’t?",
                  ].map((q) => (
                    <li
                      key={q}
                      className="flex items-center rounded-xl border border-line bg-bg px-4 py-4 font-serif-italic text-[15px] leading-snug text-ink sm:px-5 sm:text-lg"
                    >
                      {q}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 space-y-5 text-[1.05rem] leading-[1.85] text-muted">
                  <p>
                    When something matters, it makes sense to reach for the
                    response that feels responsible — ask again, send another
                    reminder, offer the better option.
                  </p>
                  <p>
                    But sometimes the response meant to help introduces more
                    pressure than you intended. The reminder may carry doubt.
                    The advice may become the main thing they hear.
                  </p>
                  <p className="font-serif-italic text-xl text-ink">
                    Over time, the familiar response can shape the relationship
                    more than the original situation did.
                  </p>
                </div>
              </Reveal>

              {/* Recognition image. The document's constraint is strict and this
                  frame satisfies it: adult only, no child anywhere in shot,
                  ordinary domestic setting, unstaged. The product examines the
                  parent, so child imagery here would contradict the one thing
                  this section exists to establish — who is being scored.

                  The source is a tall 2:3 portrait. It is given a 4:5 frame and
                  cropped with object-cover rather than being letterboxed: at
                  full portrait height it would tower over the text column it
                  sits beside and pull the eye off the argument. object-top
                  keeps the figure and the window (the subject) in frame while
                  the crop takes from the empty floor at the bottom. */}
              <Reveal as="figure" delay={250} className="lg:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                  <Image
                    src="/images/recognition.jpg"
                    alt="A parent standing at a window in an ordinary room, looking out, mid-thought."
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                  {/* Scrim: the photo is markedly lighter and warmer than the
                      navy ground, so without this it reads as a bright rectangle
                      pasted onto the page. A bottom-weighted gradient in the
                      background colour settles it into the section and gives the
                      caption a ground to sit on. */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--background) 12%, transparent) 0%, color-mix(in srgb, var(--background) 30%, transparent) 55%, color-mix(in srgb, var(--background) 88%, transparent) 100%)",
                    }}
                  />
                </div>
                <figcaption className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-faint">
                  The moment before the response
                </figcaption>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <CtaBlock location="recognition" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ============ Block 06 · What's inside your score ============ */}
        <section
          className="border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="whats-inside-heading"
        >
          <SectionViewTracker event="whats_inside_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="IV · Your result"
              id="whats-inside-heading"
              lead="What&rsquo;s inside"
              emphasis="your score."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Your result may suggest a possible belief shaping the pattern.
                You decide whether it fits.
              </p>
            </ChapterHead>

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <ol className="grid grid-cols-1">
                  {WHATS_INSIDE.map((item, i) => (
                    <Reveal
                      as="li"
                      key={item}
                      delay={i * 80}
                      className="row-interactive grid grid-cols-12 items-baseline gap-6 border-t border-line py-7 last:border-b sm:gap-10 sm:py-8"
                    >
                      <span className="row-num col-span-2 font-serif-italic text-3xl text-faint sm:text-4xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="col-span-10 flex items-baseline gap-3 font-serif text-xl leading-snug text-ink sm:text-2xl">
                        <span className="row-mark" aria-hidden />
                        {item}
                      </p>
                    </Reveal>
                  ))}
                </ol>

                <Reveal delay={200} className="mt-10">
                  <MagneticButton className="inline-block">
                    <CtaBlock location="whats_inside" />
                  </MagneticButton>
                </Reveal>
              </div>

              {/* The deliverables deck: two real artifacts overlapped so the
                  result reads as an object you receive rather than a screen you
                  glance at. Same composition as the funnel landing's take-home
                  section, in this page's tokens.

                  Both captures show the parent-facing result surface only — no
                  child assessment, no paid-only content, and no belief
                  hypothesis, which the document forbids showing unless it
                  belongs to a consented participant. */}
              <Reveal as="figure" delay={250} className="lg:col-span-5">
                <div className="relative mx-auto w-full max-w-md">
                  <span aria-hidden className="take-halo" />
                  <div className="take-back relative w-[88%] origin-bottom-left">
                    <div className="overflow-hidden rounded-md border border-line shadow-[var(--elev-3)]">
                      <Image
                        src="/take/reportpdf.png"
                        alt="A page from the optional detailed breakdown, composed around the parent's own answers."
                        width={957}
                        height={896}
                        sizes="(max-width: 1024px) 60vw, 30vw"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                  {/* Negative margin overlaps the cards; absolute positioning
                      left too much vertical dead space at narrow widths.

                      The overlap is -9%, not the -18% this composition used
                      when the back card was a wide 4:3 page. The updated
                      breakdown capture is nearly square, so the deeper overlap
                      buried its score ring and the first two pillars — the
                      part that makes it read as a result rather than as a
                      generic document. -9% still reads as a stack while
                      leaving the back card's top third clear. */}
                  <div className="take-front relative -mt-[9%] ml-auto w-[74%] origin-top-right">
                    <div className="overflow-hidden rounded-md border border-line-strong shadow-[var(--elev-3-lift)]">
                      <Image
                        src="/take/reportsummary.png"
                        alt="The result summary, reflecting the parent's own described pattern back to them."
                        width={1893}
                        height={848}
                        sizes="(max-width: 1024px) 55vw, 26vw"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-faint">
                  Illustrative. Yours is built from your own words.
                </figcaption>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ====== Block 07 · Generic advice vs. your own description ====== */}
        <section className="border-t border-line bg-surface py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal as="div">
                <p className="eyebrow mb-6">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  Generic advice
                </p>
                <p className="font-serif text-2xl leading-snug text-faint sm:text-3xl">
                  begins with a category.
                </p>
              </Reveal>
              <Reveal as="div" delay={150}>
                <p className="eyebrow mb-6">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  The Parenting Belief Score
                </p>
                <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                  begins with your description of what actually happened.
                </p>
                <p className="mt-8 font-serif-italic text-xl text-ink">
                  You remain the authority on your own parenting.
                </p>
              </Reveal>
            </div>

            {/* Block 08 — the reassurance the document places right after the
                comparison, so "examine your pattern" can never be misread as
                "care less". */}
            <Reveal delay={200}>
              <div className="mt-14 rounded-xl border border-line bg-bg p-6 sm:mt-16 sm:p-10">
                <h2 className="text-headline">This isn&rsquo;t about caring less</h2>
                <p className="mt-5 text-[1.05rem] leading-[1.85] text-muted">
                  You may still ask the question. You may still offer help. You
                  may still set a boundary. You may still say no.
                </p>
                <p className="mt-4 font-serif-italic text-xl leading-[1.6] text-ink">
                  But you can do it with more choice — and with less need for
                  the interaction to prove you&rsquo;ve done enough.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ Block 09 · Founder and credentials ============ */}
        <section
          className="border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="founder-heading"
        >
          <SectionViewTracker event="founder_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="V · The founder"
              id="founder-heading"
              lead="Why I built"
              emphasis="the Parenting Belief Score."
            />

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal as="div" delay={150} className="lg:col-span-4">
                {/* The document specifies a 400×400 portrait here. The source
                    was a 1400×1867 headshot, resized to 900px on its long edge
                    (2.9MB -> 177KB; it renders at most 400px). It is cropped
                    square by the container (object-cover, top-weighted so the
                    crop takes the face rather than centring on the torso)
                    rather than being letterboxed or distorted. */}
                <figure className="mx-auto w-full max-w-[400px]">
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                    <Image
                      src="/manuj/founder.jpg"
                      alt="Manuj Aggarwal, founder of AI Merge and creator of the Parenting Belief Score."
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover object-top"
                    />
                  </div>
                </figure>
              </Reveal>

              <Reveal as="div" delay={250} className="lg:col-span-8">
                <div className="space-y-5 text-[1.05rem] leading-[1.85] text-muted">
                  <p>
                    I understood the visible parenting moment. I could see when
                    care became pressure, when uncertainty became urgency, and
                    when the story in my mind moved faster than the evidence in
                    front of me.
                  </p>
                  <p>
                    Understanding the situation didn&rsquo;t automatically
                    reveal what was shaping my response. That gap is why I built
                    the Parenting Belief Score — using AI Merge, a methodology I
                    created and published in the Mensa Research Journal.
                  </p>
                  <p className="font-serif-italic text-xl text-ink">
                    The result isn&rsquo;t meant to replace your judgment.
                    It&rsquo;s meant to give you something clear enough to
                    examine.
                  </p>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="text-title">Manuj Aggarwal</p>
                  <p className="mt-2 text-sm leading-relaxed text-faint">
                    Founder &amp; CIO, TetraNoodle Technologies · Four patents ·
                    Published in the Mensa Research Journal
                  </p>
                </div>

                <Reveal delay={150}>
                  <CtaBlock location="founder" className="mt-10 sm:items-start" />
                </Reveal>
              </Reveal>
            </div>

            {/* Client logo strip — CRO A/B test arm, see SHOW_LOGO_STRIP. */}
            {SHOW_LOGO_STRIP && (
              <Reveal delay={300}>
                <div className="mt-16 border-t border-line pt-10">
                  <p className="eyebrow mb-8 text-center">
                    Prior professional work
                  </p>
                  <ul className="grid grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:grid-cols-5 sm:gap-x-12">
                    {TRUST_LOGOS.map((logo) => (
                      <li key={logo.alt} className="relative h-7 w-full">
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          sizes="(min-width: 640px) 120px, 100px"
                          className="object-contain opacity-60 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0"
                        />
                      </li>
                    ))}
                  </ul>
                  {/* Mandatory whenever the strip is shown. */}
                  <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-faint">
                    Organizations shown reflect prior professional work by Manuj
                    Aggarwal and do not imply endorsement of the Parenting
                    Belief Score, AI Merge, TetraNoodle Technologies, or this
                    offer.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ============== Block 10 · Participant proof ==============
            The document is explicit: "Empty until real proof exists. Do not
            invent." So this renders the collection brief, not testimonials. */}
        <section className="border-t border-line bg-surface py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <AssetSlot
              priority="Empty until real proof exists"
              title="Participant proof"
              spec="Three consented quotes · collect immediately post-launch"
              aspect="aspect-auto"
            >
              <p>
                Do not invent. Collect three consented quotes immediately
                post-launch.
              </p>
              <p>
                Priority order: 1. parent recognised their own pattern · 2.
                parent identified a useful possible belief · 3. parent made one
                participant-controlled choice · 4. parent repeated a different
                response · 5. parent became less dependent on external guidance.
              </p>
              <p className="text-ink">
                Never use testimonials that promise child change.
              </p>
              <p>
                Interim option: a completed-score count, once the number
                isn&rsquo;t embarrassing.
              </p>
            </AssetSlot>
          </div>
        </section>

        {/* ====== Block 11 · How it works (five questions, one moment) ====== */}
        <section
          className="border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="how-heading"
        >
          <SectionViewTracker event="how_it_works_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="VI · How it works"
              id="how-heading"
              lead="Five questions. One moment."
              emphasis="Your result."
            />

            <ChapterRule />

            <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 90}
                  className="bg-bg p-6 sm:p-7"
                >
                  <span className="font-serif-italic text-3xl text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-title">{step.title}</p>
                  <p className="mt-2 text-sm leading-[1.75] text-faint">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={200}>
              <CtaBlock location="how_it_works" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* Walkthrough — the real assessment screens, so the ask has a
            visible shape before the visitor commits. */}
        <WalkthroughSection />

        {/* ============ Block 12 · Questions parents ask ============ */}
        <section
          className="border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="faq-heading"
        >
          <SectionViewTracker event="faq_view" />
          <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <Reveal as="div" className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="eyebrow mb-6">VIII · Questions</p>
                <h2 id="faq-heading" className="text-section">
                  Questions
                  <span className="block font-serif-italic">parents ask.</span>
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-muted">
                  Answered in the spirit we hope you&rsquo;ll bring to the
                  questions themselves — plainly, and without hurry.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="border-t border-line">
                  {ESSENTIAL_FAQS.map((faq) => (
                    <FaqItem key={faq.q} question={faq.q}>
                      {faq.a.map((para) => (
                        <p key={para}>{para}</p>
                      ))}
                    </FaqItem>
                  ))}
                </div>
                <Reveal delay={150}>
                  <CtaBlock location="faq" className="mt-10 sm:items-start" />
                </Reveal>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================== Block 13 · Final CTA ================== */}
        <section
          className="border-t border-line py-20 sm:py-28"
          aria-labelledby="final-heading"
        >
          <SectionViewTracker event="final_cta_view" />
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <p className="eyebrow mb-6">
                <span className="pulse-dot mr-2.5" aria-hidden />A closing
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="final-heading" className="text-section">
                <WordReveal
                  segments={[
                    { kind: "text", text: "You already know" },
                    { kind: "br" },
                    { kind: "italic", text: "what keeps happening." },
                  ]}
                />
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-8 max-w-2xl text-body-lg text-muted">
                Now see what may be shaping your response before it happens
                again. Five questions, your own words, your result immediately.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <CtaBlock location="final" className="mt-10" />
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-6 text-sm text-faint">
                Your result is a personalised hypothesis. You decide what fits.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Block 14 lives in SiteFooter. */}
      <SiteFooter />
      <MobileStickyCta />
    </>
  );
}
