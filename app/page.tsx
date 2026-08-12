import Image from "next/image";
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
  return (
    <>
      {/* LCP preload, desktop only.

          The hero video's poster is the largest element in the initial viewport
          on DESKTOP, and a `poster` attribute is only discovered once the
          <video> is parsed and browsers fetch posters at low priority — so
          without a hint it loses the race to assets that matter less.

          On a phone it is a different picture entirely, and that is the traffic
          this page is bought for. The hero stacks an eyebrow, a two-line
          display headline and two subheads above the player, so at 412x915 the
          poster is at or below the fold while the LCP element is the headline.
          Fetching 63 KB at `fetchPriority: high` there does not make anything
          visible sooner; it takes bandwidth from the font, the stylesheet and
          the JavaScript that do, on the one connection they all share.

          `media` is what keeps both cases right, and it is why this is a
          rendered <link> rather than ReactDOM.preload — the latter has no
          media option, so it cannot express "desktop only". React hoists this
          into <head> exactly like any other preload. */}
      <link
        rel="preload"
        as="image"
        href="/video/vsl-parents-poster.jpg"
        fetchPriority="high"
        media="(min-width: 768px)"
      />
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
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-6 pt-6 text-center sm:px-8 sm:pb-10 sm:pt-16">
            <Reveal priority>
              {/* "For parents", not "AI Merge". The chip is the first line a
                  visitor reads, and it was spending that position on the
                  vendor's name - a brand nobody arriving from an ad recognises
                  yet. Naming the audience instead means the fold says who this
                  is for twice, in the chip and again in the headline, which is
                  the message-match the CRO audit's #1 finding was about.

                  AI Merge still appears further down, where it is doing
                  credibility work rather than occupying the first glance. */}
              <p className="cred-chip">
                For parents · Free Parenting Belief Score
              </p>
            </Reveal>
            <Reveal priority delay={80}>
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
              {/* Two lines, no dash. The em dash was doing a job punctuation
                  should not have to do here: it was holding together a
                  statement and its qualifier that are better read as two
                  beats. Breaking them onto their own lines says the same thing
                  and gives the italic clause the weight it is carrying, which
                  is the objection the whole page answers. */}
              <h1 id="hero-headline" className="text-display mt-6 sm:mt-8">
                <span className="block">
                  For parents who want to trust themselves in this.
                </span>
                <span className="mt-1 block text-emphasis sm:mt-2">
                  Without it costing the relationship.
                </span>
              </h1>
            </Reveal>
            <Reveal priority delay={140}>
              {/* ONE subhead, not three stacked paragraphs.

                  The hero previously ran the spec's fragments, then the
                  small/large contrast, then a product explanation, as three
                  separate blocks of near-identical weight. Three paragraphs
                  competing at the same size is what made the fold feel like
                  reading rather than recognising - a visitor has to work out
                  which line matters, and most will not bother.

                  Now there is a clear order: the four moments (recognition),
                  then the turn in ink (the point), and the product sentence
                  moves out of the hero entirely - it is the CTA microcopy's
                  job, and it was the one line here nobody needed before
                  deciding to care. */}
              <p className="mt-4 max-w-xl text-balance text-[17px] leading-[1.7] text-muted sm:mt-7 sm:text-body-lg sm:leading-[1.75]">
                A quiet week. An unfinished responsibility. Another reminder. A
                decision you wouldn&rsquo;t have made.
              </p>
            </Reveal>
            <Reveal priority delay={190}>
              {/* Two sentences, two lines. Left to wrap on its own, the break
                  landed mid-phrase ("…small. What it / begins to mean…"),
                  which reads as a typo. Splitting on the sentence boundary
                  puts the break where the contrast already is: small moment on
                  one line, large meaning on the next. */}
              {/* `inline sm:block` on the second sentence, not `block`
                  everywhere. On desktop the two sentences get their own lines,
                  so the break lands on the contrast the copy is built on
                  rather than mid-phrase. On a phone that same split forced a
                  third line and pushed the CTA off the first screen, so there
                  the sentences run together and wrap naturally - at 390px the
                  text is narrow enough that they break sensibly anyway. */}
              <p className="mt-4 max-w-xl text-balance text-[17px] leading-[1.7] text-ink sm:mt-5 sm:text-balance sm:text-[1.2rem] sm:leading-[1.6]">
                The moment may be small.{" "}
                <span className="inline sm:block">
                  What it begins to mean can become much larger.
                </span>
              </p>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal immediate>
              <VslPlayer />
            </Reveal>
            <Reveal priority delay={260}>
              <CtaBlock location="hero" className="mt-8" />
            </Reveal>
          </div>

          {/* The atmosphere fragments that used to sit here now open the hero
              as the subhead, where the spec places them — above the VSL, doing
              the recognition work before a visitor decides whether to watch
              anything. What remains here is only the methodology line. */}
          <Reveal priority delay={320}>
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

                {/* Rendered, not photographed.

                    This slot used to hold a capture that printed an overall of
                    14, while the same illustrative example rendered a different
                    number in the result section further down. Two numbers for
                    one example is a small, avoidable trust ding (CRO audit
                    #8/#12), and it cannot be fixed in code while the number is
                    baked into pixels.

                    ReportPreviewCard derives its overall from SAMPLE_SUBSCORES
                    through the assessment's own weighting, so every rendered
                    result on this page shows the same figure for the same
                    reason: it is one piece of arithmetic, not a value typed
                    twice. Those subscores now come from a real completed run,
                    and the weighting reproduces that run's published overall
                    exactly - so the page agrees with the product as well as
                    with itself.

                    It also fixes the legibility problem the capture had at this
                    width (~1900px of UI in a 5-column slot), which is why the
                    zoom affordance is no longer needed here. */}
                <div className="mt-8 overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                  <ReportPreviewCard />
                </div>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-faint">
                  The shape of your result
                </p>
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

                  Shows a parent WITH a child, which is a deliberate owner
                  decision that overrides the source document's constraint for
                  this slot ("No children in frame - the product examines the
                  parent, and child imagery contradicts that on a page whose
                  whole job is establishing who is being scored").

                  The reasoning for the override: an adult alone is ambiguous.
                  A visitor cannot tell whether the person is a parent, so the
                  frame does not establish the audience, and the section's job
                  is recognition. A relational cue makes "this is about
                  parenting" legible in the first glance.

                  Do not silently revert this to an adult-only frame. If it
                  needs to change, it is a product decision, not a cleanup.

                  Two known costs, recorded so they are not rediscovered later:

                  1. AGE MISMATCH. The child reads about four or five, while
                     every moment in this section's copy is teen-or-older (a
                     report card, a move getting closer, a decision already
                     made, "never actually asked"). A parent of a teenager may
                     read the picture as "not for me". The fix is a re-shoot or
                     re-source with an older child, not a code change.
                  2. AD REVIEW. The child is sharp and facing the lens on a
                     page about scoring. Meta review treats implied assessment
                     of a minor as a rejection category; the mitigation would
                     be a frame where the child is turned away, partial, or out
                     of focus.

                  TODO(launch): re-source to the approved Ads.md direction - a
                  parent outside a teenager's closed bedroom door, ordinary and
                  respectful, soft hallway lighting - which carries the
                  parenting cue with the child off-camera and resolves both
                  costs above.

                  The source is a tall 2:3 portrait. It is given a 4:5 frame and
                  cropped with object-cover rather than being letterboxed: at
                  full portrait height it would tower over the text column it
                  sits beside and pull the eye off the argument. object-top
                  keeps the face and the window (the subject) in frame while
                  the crop takes from the bottom. */}
              <Reveal as="figure" delay={250} className="min-w-0 lg:col-span-5">
                {/* signal-halo puts a glow BEHIND the frame so the photo sits
                    in the page's light rather than on top of it;
                    img-hover-zoom is the same slow scale every other image on
                    the page uses. The halo's inset is vertical-only by design
                    — see the note on .signal-halo in globals.css. */}
                <div className="signal-halo img-hover-zoom relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                  <Image
                    src="/images/recognition.jpg"
                    alt="A parent sitting beside their child, turned toward them, mid-thought."
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                  {/* Scrim weighted back up for this photo. The frame it
                      replaced was low-key and warm and needed almost nothing;
                      this one is bright, cool and high-key (white tile, white
                      shirts), so without a real gradient it punches a pale
                      rectangle into the navy ground. Bottom-weighted so the
                      caption still has something to sit on. */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--background) 14%, transparent) 0%, color-mix(in srgb, var(--background) 34%, transparent) 55%, color-mix(in srgb, var(--background) 88%, transparent) 100%)",
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

            {/* Single column now. This was a two-track grid whose right side
                held a capture of the optional PDF breakdown; that artifact is
                gone from this section, following the Coaches page, which shows
                only the final result here and leaves the deeper document to be
                discovered after the score. One frozen raster of a document
                nobody has earned yet was competing with the live-rendered
                result beside it. */}
            <div className="grid gap-12">
              {/* `min-w-0` is load-bearing, and the reason is
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
              <div className="min-w-0">
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

                      This is the CRO audit's drafted wording, verbatim, and it
                      opens on a biographical fact ("I have two teenage sons")
                      confirmed by the owners before publishing. That matters
                      beyond accuracy: it is a first-person claim about a real
                      person on a page whose entire pitch is honesty, so it is
                      not the kind of detail to infer from a persona document.

                      It also quietly repairs an inconsistency elsewhere. The
                      recognition photo shows a young child while every moment
                      in this page's copy is teen-or-older; "teenage" in the
                      founder's own voice puts the right life stage back on the
                      page in words while the image is what it is.

                      The pattern underneath is ICP #1: a fluctuating,
                      developmentally normal closeness/distance cycle, where the
                      behavioural evidence is more reliable than the narrative
                      a parent builds from a few quiet days. */}
                  <p>
                    I have two teenage sons. Some weeks they&rsquo;re close,
                    some weeks the distance stretches, and I caught myself
                    reading a few quiet days as a verdict on the relationship,
                    when the more reliable evidence said otherwise.
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
