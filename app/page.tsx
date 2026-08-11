import Image from "next/image";
import ReactDOM from "react-dom";
import {
  Award,
  BookOpen,
  Building2,
  Check,
  HeartHandshake,
  Lock,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { FaqItem } from "@/components/faq-item";
import { LandingAnalytics } from "@/components/landing-analytics";
import { MacWindow } from "@/components/mac-window";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { WordReveal } from "@/components/motion";
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
import { DeviceFrame } from "@/components/visuals/device-frame";
import { ReportPreviewCard } from "@/components/visuals/report-preview";
import {
  BeliefLoop,
  GenericAdvicePanel,
  RECOGNITION_SCENES,
  StepGlyph,
  YourWordsPanel,
} from "@/components/visuals/scenes";
import { PillarDial } from "@/components/visuals/score-visuals";
import { VslPlayer } from "@/components/vsl-player";
import { WalkthroughSection } from "@/components/walkthrough";
import { ZoomableShot } from "@/components/zoomable-shot";
import type { CtaLocation } from "@/lib/analytics";
import { ESSENTIAL_FAQS, toFaqEntries } from "@/lib/faq";
import {
  PILLAR_COLORS,
  PILLAR_ICONS,
  PILLAR_LABELS,
  PILLAR_ORDER,
  PILLAR_TEXT_COLORS,
  SAMPLE_SUBSCORES,
} from "@/lib/pillars";
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
  "What it begins to mean to you - before you’ve consciously decided.",
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

/* Block 10: participant quotes.

   Both are from the broader AI Merge work, and the disclaimer under the cards
   says exactly that rather than implying they came from this free score.

   Chosen against one hard filter: each describes a shift the SPEAKER noticed
   in THEMSELVES. Nothing here claims another person changed, which is the same
   boundary the rest of the page holds — a parenting testimonial that promised
   a child would behave differently would break the product's central claim on
   the one section meant to make it believable.

   TODO(launch): verify exact wording, name or approved anonymity, role, and
   written consent for display on THIS funnel before launch. */
const TESTIMONIALS = [
  {
    quote: "There's a stress part of my brain that has gone silent.",
    name: "Nick H.",
    role: "Video Producer",
  },
  {
    quote:
      "It shifted something within. It's something I'm going to be reading over and over again.",
    name: "Oliver",
    role: "Real Estate",
  },
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
        {/* The page's lighting, finally mounted.

            All three of these layers were fully written in globals.css and
            rendered by NOTHING — the page was shipping the CSS for an ambient
            system it never turned on. They cost no layout and no JS:
            `.ambient-field` is a document-anchored column of very faint radial
            sources that scrolls with the content it lights, and
            `.page-vignette` is viewport-fixed so the vignette hugs the screen
            edge and the key light stays behind the sticky header CTA at every
            scroll position. Both sit at z-index -1, behind everything. */}
        <div className="ambient-field" aria-hidden />
        <div className="page-vignette" aria-hidden />

        {/* ================== Block 01 · Hero ==================
            Structure mirrors the Coaches and Consultants hero exactly:
            eyebrow, headline, VSL, CTA, trust line, credibility line. No
            supporting paragraph between the headline, the VSL and the CTA. */}
        <section id="hero" className="relative overflow-hidden">
          {/* The signature spotlight: one large soft orb centred behind the
              headline. Capped at 100vw in CSS so it can never add document
              width on a narrow phone. */}
          <div className="spotlight-hero" aria-hidden />
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
              {/* The approved LP.md headline, restored.
                  The live build had been running "See what's shaping your
                  response before the next conversation" — a line that could
                  belong to a marriage page, a management page, or a therapy
                  page. The CRO audit's #1 critical finding: the most-read line
                  on the page named no audience and no situation, and this
                  headline had already solved that and was quietly dropped.

                  "For parents" is now the second word, so the ad-to-page match
                  happens in the first glance rather than in the eyebrow.

                  The italic clause carries the objection the whole page exists
                  to answer: a parent who wants to trust themselves does not
                  want to buy that confidence at the relationship's expense.

                  TODO(paid traffic): swap this per utm_content using the
                  Landing-Page Bridge line already written for each ad in
                  Ads.md (Pulling-Away Teenager → "When ordinary distance
                  starts feeling permanent," etc.). No new copy needed, just
                  the wiring. */}
              <h1 id="hero-headline" className="text-display mt-6 sm:mt-8">
                For parents who want to trust themselves in this
                <span className="text-emphasis">
                  {" "}&mdash; without it costing the relationship.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              {/* The spec's four atmosphere fragments. Restored as the subhead
                  rather than as the loose paragraph they used to be below the
                  CTA: four concrete situations do the work the old generic
                  subhead ("Answer five questions about one real parenting
                  moment") could not, which is letting a reader recognise their
                  own moment before they have decided whether to care.

                  Set as its own line so the fragments read as a list of
                  moments rather than one run-on sentence. */}
              <p className="mt-4 max-w-2xl text-balance text-[17px] leading-[1.65] text-muted sm:mt-6 sm:text-body-lg sm:leading-[1.7]">
                A quiet week. An unfinished responsibility. Another reminder. A
                decision you wouldn&rsquo;t have made.
              </p>
            </Reveal>
            <Reveal delay={180}>
              {/* The second sentence is its own block, not an inline <span>
                  inside the first. Inline, `text-balance` split it mid-phrase
                  ("…small. What it / begins to mean…"), which reads as a typo.
                  As two lines the contrast the copy is built on — small moment,
                  large meaning — lands on the break instead of fighting it. */}
              <p className="mt-3 max-w-2xl text-balance text-[17px] leading-[1.65] text-muted sm:mt-4 sm:text-body-lg sm:leading-[1.7]">
                The moment may be small.
                <span className="mt-1 block text-ink">
                  What it begins to mean can become much larger.
                </span>
              </p>
            </Reveal>
            <Reveal delay={220}>
              {/* Smallest of the three, and the only one a visitor can skip
                  without losing the argument: it explains the product, while
                  the two above it do the recognising. Hidden on phones, where
                  three stacked blocks pushed the CTA below a second screen —
                  the same sentence is the CTA microcopy's job there. */}
              <p className="mt-4 hidden max-w-2xl text-balance leading-[1.8] text-faint sm:block">
                The free Parenting Belief Score helps you examine what may be
                shaping your own interpretation and response &mdash; in one real
                parenting moment.
              </p>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal immediate>
              <VslPlayer />
            </Reveal>
            <Reveal delay={260}>
              <CtaBlock location="hero" className="mt-8" />
            </Reveal>
          </div>

          {/* The atmosphere fragments that used to sit here now open the hero
              as the subhead, where the spec places them — above the VSL, doing
              the recognition work before a visitor decides whether to watch
              anything. What remains here is only the methodology line. */}
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
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="question-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="question_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="I · The question"
              id="question-heading"
              lead="What happens inside you"
              emphasis="between noticing and deciding?"
            >
              <p className="text-lg leading-[1.8] text-muted">
                The Parenting Belief Score isn&rsquo;t asking you to ignore
                what&rsquo;s real, or to accept that you&rsquo;re doing anything
                wrong. It asks one additional question - the one to the left.
              </p>
              <p className="mt-4 font-serif-italic text-xl text-ink">
                It examines your pattern, not your child&rsquo;s.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* The two objections, granted rather than argued with.

                Compressed from two full cards to two chips. Both used to carry
                a follow-up paragraph, and both paragraphs said the same thing
                the heading already says ("that may be true"). Granting an
                objection needs one line; arguing needs three, and the page is
                explicitly not arguing here. */}
            <ul className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                "But the situation with my child is real.",
                "I’m not trying to control anything. I just want to stay close.",
              ].map((objection, i) => (
                <Reveal as="li" key={objection} delay={150 + i * 80}>
                  <blockquote className="flex h-full items-start gap-3 rounded-xl border border-line bg-bg px-5 py-4">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-signal"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block font-serif-italic text-[17px] leading-snug text-ink">
                        &ldquo;{objection}&rdquo;
                      </span>
                      <span className="mt-1.5 block text-sm text-faint">
                        That may be true.
                      </span>
                    </span>
                  </blockquote>
                </Reveal>
              ))}
            </ul>

            {/* The mechanism, drawn.

                This section is the page's hinge, and it used to be the page's
                only wholly text-only screen: a headline, a lede, and two
                paragraph cards. The loop it describes is a SHAPE — concern
                drives intervention, intervention hides the counter-evidence,
                the missing evidence feeds the concern — and a shape is the one
                thing prose is worst at carrying. */}
            <Reveal delay={200}>
              <div className="mt-12 sm:mt-14">
                <BeliefLoop />
              </div>
            </Reveal>

            <Reveal delay={300}>
              <CtaBlock location="question" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ========= Block 04 · How your words become your score =========
            The page's central proof. A described moment on the left, the
            result fields it produces on the right. */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="score-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="score_visual_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="II · The mechanism"
              id="score-heading"
              lead="How your words"
              emphasis="become your score."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Describe one real moment. No polished explanation required.
                Your score reflects the pattern back, then you receive your
                personalised result immediately - no credit card, no waiting.
              </p>
            </ChapterHead>

            <ChapterRule />

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              {/* What the parent writes. */}
              <Reveal as="div" delay={150} className="min-w-0 lg:col-span-5">
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
                  src="/take/reportsummary.jpg"
                  alt="The live result screen, showing a completed score with the pattern reflected back to the participant."
                  width={1920}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  caption="The live result screen"
                  event="result_screen"
                />
              </Reveal>

              {/* What the score returns. */}
              <Reveal as="div" delay={250} className="min-w-0 lg:col-span-7">
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
                        <dt className="col-span-12 text-[12px] uppercase tracking-[0.16em] text-faint sm:col-span-4">
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
                <p className="mt-3 text-center text-[12px] uppercase tracking-[0.16em] text-faint">
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
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="recognition-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="recognition_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="III · Recognition"
              id="recognition-heading"
              lead="Patterns become visible"
              emphasis="in ordinary moments."
            >
              <p className="text-lg leading-[1.8] text-muted">
                It rarely announces itself. It arrives inside something
                ordinary - and you hear yourself asking the same question
                again.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* Four separate moments, not one sentence.

                Each fragment is a real situation from a DIFFERENT ICP card
                (teenager distance / achievement / a move or departure / a
                request). Run together as prose, a reader skims all four and
                none of them lands as THEIR moment - which is the one job this
                lede has. As four tiles the eye stops on the one that is true
                for them.

                TODO(paid traffic): for ad clicks, show or highlight the
                matching ICP's tile first, using the same utm_content swap the
                hero headline will use. */}
            <Reveal delay={100}>
              <ul className="mb-12 grid list-none gap-3 sm:mb-14 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "A week goes by without much being said.",
                  "A report card arrives.",
                  "A move gets closer.",
                  "Another request arrives.",
                ].map((moment, i) => (
                  <li
                    key={moment}
                    className="flex items-start gap-3 rounded-xl border border-line bg-bg px-5 py-5"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: `var(--pillar-${i + 1})`,
                        opacity: 0.8,
                      }}
                    />
                    <span className="font-serif text-[17px] leading-snug text-ink">
                      {moment}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

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

                {/* Three ordinary moments, drawn from their artifacts.

                    CUT: two explanatory paragraphs stood here ("When something
                    matters, it makes sense to reach for the response that feels
                    responsible…", "But sometimes the response meant to help
                    introduces more pressure than you intended. The reminder may
                    carry doubt. The advice may become the main thing they
                    hear."). Both were describing pictures — a third reminder, a
                    plan gaining options, a decision already made — so they are
                    now the pictures. The closing italic line stays, because it
                    is the turn the section is built to land and no drawing
                    carries "over time". */}
                <ul className="mt-8 grid list-none gap-3 sm:grid-cols-3 sm:gap-4">
                  {RECOGNITION_SCENES.map(({ Scene, caption }, i) => (
                    <Reveal as="li" key={caption} delay={150 + i * 90}>
                      <figure className="flex h-full flex-col">
                        <Scene />
                        <figcaption className="mt-3 text-[13px] leading-[1.6] text-faint">
                          {caption}
                        </figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </ul>

                <p className="mt-8 font-serif-italic text-xl leading-[1.5] text-ink">
                  Over time, the familiar response can shape the relationship
                  more than the original situation did.
                </p>
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
              <Reveal as="figure" delay={250} className="min-w-0 lg:col-span-5">
                {/* signal-halo puts a glow BEHIND the frame so the photo sits
                    in the page's light rather than on top of it;
                    img-hover-zoom is the same slow scale every other image on
                    the page uses. The halo's inset is vertical-only by design
                    — see the note on .signal-halo in globals.css. */}
                <div className="signal-halo img-hover-zoom relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
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
                <figcaption className="mt-4 text-center text-[12px] uppercase tracking-[0.16em] text-faint">
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
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="whats-inside-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="whats_inside_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
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
              {/* `min-w-0` is load-bearing on BOTH tracks, and the reason is
                  subtle enough to be worth stating so it does not get removed
                  as noise.

                  The device frame below contains a title chip with `truncate`,
                  which implies `white-space: nowrap`. A nowrap element's
                  min-content is its full string width (240px for
                  "your-parenting-belief-score"). `min-w-0` on the chip itself
                  lets flex shrink it during layout, but it does NOT change what
                  it contributes to an ancestor's intrinsic sizing — and a grid
                  column is `minmax(auto, 1fr)`, whose `auto` minimum resolves
                  to the grid ITEM's automatic minimum size. So the track was
                  pinned at 324px on a 320px screen and the whole column was
                  being clipped by the page's `overflow-x: clip`, which hides
                  the scrollbar but not the damage. `min-w-0` here is what
                  releases the track. */}
              <div className="min-w-0 lg:col-span-7">
                <ol className="grid grid-cols-1">
                  {WHATS_INSIDE.map((item, i) => (
                    <Reveal
                      as="li"
                      key={item}
                      delay={i * 80}
                      // Flex, not `grid-cols-12 gap-6`. A 12-column grid with
                      // a 24px gap spends 11 x 24 = 264px on gutters alone; on
                      // a 320px screen with 20px page padding only 280px
                      // exists, so the row was 324px wide and its text was
                      // being clipped by the page's `overflow-x: clip`. Two
                      // flex items with one gap have no such arithmetic.
                      className="row-interactive flex items-baseline gap-4 border-t border-line py-7 last:border-b sm:gap-8 sm:py-8"
                    >
                      <span className="row-num w-10 shrink-0 font-serif-italic text-3xl text-faint sm:w-14 sm:text-4xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="flex min-w-0 items-baseline gap-3 font-serif text-xl leading-snug text-ink sm:text-2xl">
                        <span className="row-mark" aria-hidden />
                        {item}
                      </p>
                    </Reveal>
                  ))}
                </ol>

                {/* The artifact, rendered from live tokens rather than
                    photographed.

                    The page shows the result three ways on purpose, and this
                    is the one that cannot go stale: the two captures beside it
                    are raster files that freeze whatever the product looked
                    like the day they were taken, and the walkthrough shows it
                    in motion. This one is built from the same --pillar-N
                    tokens and the same SAMPLE_SUBSCORES as the dial grid
                    below, so it re-renders correctly if the palette ever moves
                    and it can never disagree with the numbers on this page.

                    Its narrative half is redaction bars, never invented
                    sentences — writing a plausible belief hypothesis here
                    would be fabricating a result for a family that does not
                    exist. The "Illustrative example" chip is inside the frame,
                    not in the caption. */}
                <Reveal delay={200}>
                  <div className="mt-10">
                    <DeviceFrame title="your-parenting-belief-score">
                      <ReportPreviewCard />
                    </DeviceFrame>
                  </div>
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
              <Reveal as="figure" delay={250} className="min-w-0 lg:col-span-5">
                <div className="relative mx-auto w-full max-w-md">
                  <span aria-hidden className="take-halo" />
                  <div className="take-back relative w-[88%] origin-bottom-left">
                    <div className="overflow-hidden rounded-md border border-line shadow-[var(--elev-3)]">
                      <Image
                        src="/take/reportpdf.jpg"
                        alt="A page from the optional detailed breakdown, composed around the parent's own answers."
                        width={1920}
                        height={1200}
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
                        src="/take/reportsummary.jpg"
                        alt="The result summary, reflecting the parent's own described pattern back to them."
                        width={1920}
                        height={1200}
                        sizes="(max-width: 1024px) 55vw, 26vw"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-6 text-center text-[12px] uppercase tracking-[0.16em] text-faint">
                  Illustrative. Yours is built from your own words.
                </figcaption>
              </Reveal>
            </div>

            {/* The four scored dimensions.

                Without these the page describes the result only in prose,
                and the reader meets the four dimensions for the first time
                inside a screenshot they cannot read. Naming them here in the
                page's own voice is what makes the capture legible when they
                reach it.

                This is also the one place the page spends colour beyond the
                teal --signal: four categorical hues, one per dimension, each
                paired with an icon and a text label so colour is never the
                only encoding. */}
            <Reveal delay={150}>
              <div className="hairline-anim hairline my-12 sm:my-14" />
            </Reveal>

            <Reveal delay={150}>
              <p className="eyebrow mb-7">
                <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                The four dimensions your score reads
              </p>
            </Reveal>

            <ul className="grid list-none gap-4 sm:grid-cols-2 sm:gap-5">
              {PILLAR_ORDER.map((key, i) => (
                <Reveal as="li" key={key} delay={i * 80}>
                  <PillarDial dimension={key} value={SAMPLE_SUBSCORES[key]} />
                </Reveal>
              ))}
            </ul>

            <Reveal delay={200}>
              {/* The document forbids presenting the score as a grade, and a
                  row of numbers invites exactly that reading unless it is
                  named. This says plainly what a low number means, and lists
                  what the score does NOT rate. */}
              <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-faint">
                Illustrative values. A lower number means more room to move on
                this pattern. It is not a grade, and it does not rate you as a
                parent, your child, or your family.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <CtaBlock location="whats_inside" className="mt-10" />
            </Reveal>
          </div>
        </section>

        {/* Walkthrough - the real assessment screens.

            Moved UP, from after the founder/proof block to directly after the
            result section. Anyone already convinced has clicked one of the
            earlier CTAs; anyone still scrolling at that depth is the most
            skeptical visitor left, and this section exists for exactly them -
            it answers "what am I actually agreeing to" by showing every screen.
            Sitting behind founder and testimonials, it was arriving after the
            point much of that audience had already left.

            It also reads better here: the reader has just seen WHAT they
            receive, so HOW they get there is the next question, not a later
            one. */}
        <WalkthroughSection />

        {/* ====== Block 07 · Generic advice vs. your own description ====== */}
        <section className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28">
          <div className="section-orbs" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            {/* Two panels of the same size and shape, so the difference
                between them is the only thing the eye has to do.

                This whole section used to be two short sentences of type on an
                empty ground — the page's clearest failure of the "no section
                is text-only" rule, and its weakest argument, because "begins
                with a category" versus "begins with your description" is a
                claim about SHAPE that was being made in words. Drawn, the
                stack of interchangeable category cards and the one handwritten
                line resolving into four scored bars make the point before
                either eyebrow is read. */}
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal as="div">
                <p className="eyebrow mb-6">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  Generic advice
                </p>
                <p className="mb-6 font-serif text-2xl leading-snug text-faint sm:text-3xl">
                  begins with a category.
                </p>
                <GenericAdvicePanel />
              </Reveal>
              <Reveal as="div" delay={150}>
                <p className="eyebrow mb-6">
                  <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                  The Parenting Belief Score
                </p>
                <p className="mb-6 font-serif text-2xl leading-snug text-ink sm:text-3xl">
                  begins with your description of what actually happened.
                </p>
                <YourWordsPanel />
              </Reveal>
            </div>

            <Reveal delay={200}>
              <p className="mt-10 text-center font-serif-italic text-xl text-ink sm:mt-12">
                You remain the authority on your own parenting.
              </p>
            </Reveal>

            {/* Block 08 — the reassurance the document places right after the
                comparison, so "examine your pattern" can never be misread as
                "care less".

                The four things a parent may still do were a run-on sentence
                ("You may still ask the question. You may still offer help…").
                As four ticked chips they are countable at a glance, which is
                what a reassurance needs to be. */}
            <Reveal delay={200}>
              <div className="mt-14 rounded-xl border border-line bg-bg p-6 sm:mt-16 sm:p-10">
                <h2 className="text-headline">This isn&rsquo;t about caring less</h2>
                <ul className="mt-6 grid list-none gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {[
                    "Still ask the question",
                    "Still offer help",
                    "Still set a boundary",
                    "Still say no",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3"
                    >
                      <Check
                        className="h-4 w-4 shrink-0 text-signal"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="min-w-0 text-[15px] text-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-serif-italic text-xl leading-[1.6] text-ink">
                  But you can do it with more choice - and with less need for
                  the interaction to prove you&rsquo;ve done enough.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ Block 09 · Founder and credentials ============ */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="founder-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="founder_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="VI · The founder"
              id="founder-heading"
              lead="Why I built"
              emphasis="the Parenting Belief Score."
            />

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal as="div" delay={150} className="min-w-0 lg:col-span-4">
                {/* The document specifies a 400×400 portrait here. The source
                    was a 1400×1867 headshot, resized to 900px on its long edge
                    (2.9MB -> 177KB; it renders at most 400px). It is cropped
                    square by the container (object-cover, top-weighted so the
                    crop takes the face rather than centring on the torso)
                    rather than being letterboxed or distorted. */}
                <figure className="mx-auto w-full max-w-[400px]">
                  {/* Halo behind the frame + the page's standard hover zoom, so
                      the one real face on the page is lit like everything else
                      rather than pasted onto the ground. */}
                  <div className="signal-halo img-hover-zoom relative aspect-square overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
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

              <Reveal as="div" delay={250} className="min-w-0 lg:col-span-8">
                {/* CUT: the opening biography paragraph ("I understood the
                    visible parenting moment. I could see when care became
                    pressure…") restated the recognition section three screens
                    earlier, in the first person. The gap it was setting up is
                    stated by the paragraph that follows it, which now opens
                    the block. */}
                <div className="space-y-5 text-[1.05rem] leading-[1.85] text-muted">
                  {/* One concrete moment before the abstract sentence.

                      With the old opening biography paragraph cut, "the
                      situation" had no referent at all - the block opened on an
                      abstraction, in the section asking hardest to be believed.
                      This is the specific thing, written from ICP pattern #1:
                      a fluctuating, developmentally normal closeness/distance
                      cycle, where the behavioural evidence is more reliable
                      than the narrative.

                      It deliberately stops short of the biographical detail the
                      CRO audit drafted ("I have two teenage sons") - that is a
                      claim about a real person that no source here establishes.
                      TODO(launch): if Manuj confirms the specifics, swap this
                      for the fuller version; it will land harder. */}
                  <p>
                    Some weeks the closeness was there. Some weeks the distance
                    stretched. I caught myself reading a few quiet days as a
                    verdict on the relationship, when the more reliable evidence
                    said otherwise.
                  </p>
                  <p>
                    Understanding the situation didn&rsquo;t automatically
                    reveal what was shaping my response. That gap is why I built
                    the Parenting Belief Score - using AI Merge, a methodology I
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
                  {/* The credential line was a single run of dot-separated
                      text. As an icon grid each claim is countable at a
                      glance and the block stops being a wall of prose beside
                      a portrait. Same four facts, nothing added. */}
                  <ul className="mt-4 grid list-none gap-2.5 sm:grid-cols-2">
                    {[
                      {
                        Icon: Building2,
                        label: "Founder & CIO",
                        detail: "TetraNoodle Technologies",
                      },
                      {
                        Icon: Award,
                        label: "Four patents",
                        detail: "Granted",
                      },
                      {
                        Icon: BookOpen,
                        label: "Mensa Research Journal",
                        detail: "Published methodology",
                      },
                      {
                        Icon: ShieldCheck,
                        label: "AI Merge",
                        detail: "Creator of the method",
                      },
                    ].map(({ Icon, label, detail }) => (
                      <li
                        key={label}
                        className="flex items-start gap-3 rounded-lg border border-line bg-card px-4 py-3"
                      >
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-signal"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-fg">
                            {label}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-faint">
                            {detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
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
            Two quotes, typographic, following the Coaches page's v3.0
            treatment — which is worth restating because it is a decision, not
            a layout.

            That page HAS a twelve-clip video wall in its repo and deliberately
            does not render it: twelve faces sitting directly above a caption
            conceding the speakers may not be from this audience and may not be
            describing this product reads as weaker than no proof at all. The
            rule it settled on is at most two clips chosen for relevance, and
            text only if none qualify. None qualify here yet, so this is text.

            The quotes are from the broader AI Merge work, and the disclaimer
            says so. They describe a shift the SPEAKER noticed in themselves —
            never a change in another person — which is the same boundary this
            whole page holds.

            No stock portraits: a face beside a quote from someone who is not
            that person is manufactured proof, and this audience is precisely
            the one that would feel it. So the visual is typography — an
            oversized quote glyph and a rule in the pillar colour.

            TODO(launch): replace with consented PARENT quotes as soon as they
            exist. Priority order from the document: recognised their own
            pattern · identified a useful possible belief · made one
            participant-controlled choice · repeated a different response ·
            became less dependent on external guidance. Never use a testimonial
            that promises child change. <TestimonialReel /> is still in the
            repo for when consented clips exist. */}
        <section className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28">
          <div className="section-orbs" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <p className="eyebrow mb-6">In their words</p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-section">
                  <span className="block">What people have noticed</span>
                  <span className="block font-serif-italic">
                    working through AI Merge.
                  </span>
                </h2>
              </Reveal>
              {/* States the gap ABOVE the quotes rather than conceding it in
                  small print underneath.

                  Neither quote is from a parent or about a parenting outcome,
                  and this sits in one of the highest-trust positions on the
                  page. A reader who works that out for themselves, after
                  reading two quotes presented as proof, trusts the page less
                  than one who was told first - so saying it up front turns a
                  silent gap into a stated promise, in the same honesty-first
                  voice the rest of the page uses.

                  TODO(launch): replace with real parent quotes as soon as
                  completions produce them, and delete this line with them. */}
              <Reveal delay={100}>
                <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.75] text-faint">
                  These are from the broader AI Merge methodology. Real parent
                  stories will appear here as soon as we have them.
                </p>
              </Reveal>
            </div>

            <ul className="mt-12 grid list-none gap-5 md:grid-cols-2">
              {TESTIMONIALS.map((t, i) => {
                // --signal, not two of the four pillar hues as before.
                //
                // The pillar palette is CATEGORICAL: each hue identifies one
                // scored dimension and nothing else. Spending teal and violet
                // on quote cards meant teal said "Direction Clarity" in the
                // result section and "first testimonial" here, which is
                // exactly the ambiguity a categorical palette exists to
                // prevent. The card's ornament is the oversized glyph and the
                // rule; it does not need a second colour system to work.
                const color = "var(--signal)";
                return (
                  <Reveal as="li" key={t.name} delay={i * 80}>
                    <figure
                      className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-7 pt-8 sm:p-8 sm:pt-9"
                      style={{
                        borderColor: `color-mix(in srgb, ${color} 28%, var(--border))`,
                      }}
                    >
                      {/* Coloured top rule + oversized glyph: the card's only
                          ornament, and the only thing carrying the pillar hue
                          outside the four dials. */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-0.5"
                        style={{ background: color, opacity: 0.65 }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[9rem] leading-none"
                        style={{ color, opacity: 0.1 }}
                      >
                        &rdquo;
                      </span>
                      <blockquote className="text-title relative flex-1">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center gap-2.5 text-sm">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                        <span className="font-medium text-fg">{t.name}</span>
                        <span className="text-faint">· {t.role}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-faint">
                Individual experiences vary. These accounts reflect experiences
                across the broader AI Merge work rather than the free Parenting
                Belief Score, and do not guarantee that another participant will
                receive the same result.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ====== Block 11 · How it works (five questions, one moment) ====== */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="how-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="how_it_works_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="VII · How it works"
              id="how-heading"
              lead="Five questions. One moment."
              emphasis="Your result."
            />

            <ChapterRule />

            {/* Each step now opens with a drawn tile rather than a numeral
                alone. Four identical boxes carrying a moment being picked,
                words being typed, a score resolving and a choice being kept:
                enough to read the sequence at a squint, and deliberately
                abstract so it does not compete with the real captures in the
                walkthrough immediately below. */}
            <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 90}
                  className="bg-bg p-6 sm:p-7"
                >
                  <StepGlyph index={i} />
                  <span className="font-serif-italic text-3xl text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-title">{step.title}</p>
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

        {/* ============ Block 12 · Questions parents ask ============ */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="faq_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left rail: heading plus the four boundaries this page is
                  built on, as cards. Sticky on desktop so they stay beside
                  whichever question the reader has opened — which is the point:
                  the four things a cautious parent most wants settled are the
                  four things they should not have to open an accordion to
                  find. `min-w-0` because the track holds arbitrary content. */}
              <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
                <Reveal>
                  <p className="eyebrow mb-6">VIII · Questions</p>
                  <h2 id="faq-heading" className="text-section">
                    Questions
                    <span className="block font-serif-italic">parents ask.</span>
                  </h2>
                </Reveal>

                <ul className="mt-9 grid list-none gap-3">
                  {[
                    {
                      Icon: UserRoundCheck,
                      color: "var(--pillar-1)",
                      ink: "var(--pillar-1-ink)",
                      label: "It examines you, not your child",
                      body: "Nothing here assesses, scores, or diagnoses your child.",
                    },
                    {
                      Icon: HeartHandshake,
                      color: "var(--pillar-2)",
                      ink: "var(--pillar-2-ink)",
                      label: "Reflective, not clinical",
                      body: "Educational - not diagnosis, treatment, or therapy.",
                    },
                    {
                      Icon: Lock,
                      color: "var(--pillar-3)",
                      ink: "var(--pillar-3-ink)",
                      label: "Free, no card",
                      body: "Five questions, about ten minutes, your result immediately.",
                    },
                    {
                      Icon: ShieldCheck,
                      color: "var(--pillar-4)",
                      ink: "var(--pillar-4-ink)",
                      label: "You decide what fits",
                      body: "The result is a possible belief, offered for you to judge.",
                    },
                  ].map(({ Icon, color, ink, label, body }, i) => (
                    <Reveal as="li" key={label} delay={100 + i * 60}>
                      <div
                        className="flex items-start gap-3.5 rounded-xl border bg-card p-4"
                        style={{
                          // Border and tint take the GRAPHICS token (3:1 is the
                          // bar for a non-text object); nothing here puts a
                          // series colour on body copy.
                          borderColor: `color-mix(in srgb, ${color} 26%, var(--border))`,
                        }}
                      >
                        <span
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: `color-mix(in srgb, ${color} 14%, transparent)`,
                            color,
                          }}
                        >
                          <Icon
                            className="h-4 w-4"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </span>
                        <span className="min-w-0">
                          {/* The one coloured LABEL on the page, so it takes
                              the lifted -ink token: at 14px on this ground the
                              graphics hue would not clear 4.5:1. */}
                          <span
                            className="block text-sm font-medium"
                            style={{ color: ink }}
                          >
                            {label}
                          </span>
                          <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                            {body}
                          </span>
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>

              {/* Right column: a plain div rather than a Reveal, so each item
                  can reveal on its own timing. */}
              <div className="min-w-0 lg:col-span-7">
                <Reveal>
                  <div className="border-t border-line">
                    {ESSENTIAL_FAQS.map((faq) => (
                      <FaqItem key={faq.q} question={faq.q}>
                        {faq.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </FaqItem>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <CtaBlock location="faq" className="mt-10 sm:items-start" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ================== Block 13 · Final CTA ================== */}
        <section
          className="relative overflow-hidden border-t border-line py-20 sm:py-28"
          aria-labelledby="final-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="final_cta_view" />
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <p className="eyebrow mb-6">
                <span className="pulse-dot mr-2.5" aria-hidden />A closing
              </p>
            </Reveal>

            {/* The four dimensions as chips, ABOVE the headline.

                The close deliberately has no image: anything sitting beside
                the button gives the eye a second place to stop. But the
                section still needs something to look at, so the graphic goes
                above the argument rather than next to the click target, and it
                is a RECAP rather than a new idea — the same four chips, in the
                same four colours and the same order, that the assessment's own
                entry screen shows (public/take/audience.jpg). A visitor who
                arrives here from a scroll sees what they are about to get in
                one row. */}
            <Reveal delay={40}>
              <ul className="mx-auto mb-9 flex list-none flex-wrap items-center justify-center gap-2">
                {PILLAR_ORDER.map((key, i) => {
                  const Icon = PILLAR_ICONS[key];
                  const color = PILLAR_COLORS[key];
                  return (
                    <li key={key}>
                      <span
                        className="rise-in inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] uppercase tracking-[0.12em]"
                        style={{
                          // Border and tint take the GRAPHICS token (3:1 is
                          // the bar for a non-text object); the label takes
                          // the lifted -ink token, because at 10.5px it is
                          // small text and needs 4.5:1 on this ground. This
                          // split is the whole reason both tokens exist.
                          borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                          background: `color-mix(in srgb, ${color} 9%, transparent)`,
                          color: PILLAR_TEXT_COLORS[key],
                          ["--rise-delay" as string]: `${i * 90}ms`,
                        }}
                      >
                        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden />
                        {PILLAR_LABELS[key].label}
                      </span>
                    </li>
                  );
                })}
              </ul>
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
