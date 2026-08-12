import Image from "next/image";
import ReactDOM from "react-dom";
import {
  Award,
  BookOpen,
  Building2,
  Check,
  FileText,
  Gauge,
  HeartHandshake,
  Lock,
  Route,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { FaqItem } from "@/components/faq-item";
import { LandingAnalytics } from "@/components/landing-analytics";
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
import { ClosenessDrift } from "@/components/visuals/closeness-drift";
import { BeliefLoop } from "@/components/visuals/scenes";
import { ScoreArch } from "@/components/visuals/score-arch";
import { PillarDial } from "@/components/visuals/score-visuals";
import { VslPlayer } from "@/components/vsl-player";
import { WalkthroughSection } from "@/components/walkthrough";
import type { CtaLocation } from "@/lib/analytics";
import { ESSENTIAL_FAQS, toFaqEntries } from "@/lib/faq";
import { PILLAR_ORDER, SAMPLE_SUBSCORES } from "@/lib/pillars";
import { ROUTES } from "@/lib/site";

/* ==========================================================================
   AI Merge · Free Parenting Belief Score doorway page.

   THE CONVERSION, IN ONE SENTENCE
   A North American parent of a 12-25 year old, arriving cold from paid
   social, who has noticed their child telling them less every year, takes the
   free Parenting Belief Score. The objection in their head on arrival is
   "this is going to tell me I'm the problem".

   NARRATIVE (v4 — rebuilt to the management brief)
   Hero (the loss, in one line) -> I the drift, drawn -> II the one part of it
   they can still change -> III what the score IS, on an arch -> IV what
   arrives -> V the product walked through -> VI who built it -> VII the
   questions -> close.

   WHAT CHANGED AND WHY, so it does not get "fixed" back:
   - The old H1 was a two-clause abstraction about "your response" with a
     three-line subhead under it. It described a mechanism to a reader who had
     not yet agreed there was a problem. The H1 is now the problem itself, in
     the reader's own vocabulary, and the subhead is one line.
   - Seven of the old twelve sections were arguments the page was having with
     itself (generic advice vs. your words; patterns in ordinary moments;
     what's inside; a standalone four-step how-it-works that the walkthrough
     already shows five steps of). They are gone. Each surviving section makes
     ONE point and then asks for the click.
   - The score used to be described only in prose and in screenshots. It now
     has a graphic of its own — the arch — that states what a low number
     means, what a high number means, and where the scale's midpoint sits.

   REGISTER — unchanged, and non-negotiable:
   - The free Parenting Belief Score is the ONLY offer on this page. The
     written breakdown and the AI Merge program are named as things that exist
     afterwards; pricing is discovered on the funnel, not here. Nothing on this
     page may imply they are included, and nothing may imply the score is
     anything other than free.
   - It examines THE PARENT'S pattern, never the child's. No section may
     assess, score, diagnose, or infer the state of a child.
   - Educational and reflective — not diagnosis, treatment, or medical,
     psychological, legal, or family-therapy services.
   - Belief is never the sole cause. Development, circumstances, personality,
     health, finances, history and culture stay explicitly real.
   - The urgency on this page is the real one (a child grows up once, and the
     habits compound), stated as recognition. No countdowns, no invented
     scarcity, no promised child outcome.
========================================================================== */

/* Block IV: what arrives, in the order it arrives.

   The free score is the offer. The two below it are named without price,
   because price is the funnel's job — but the small print under the list is
   the document's own wording and stays: a parent must never be able to say
   they were led to believe something was included when it was not. */
const WHAT_ARRIVES = [
  {
    Icon: Gauge,
    meta: "Free · on screen in about 10 minutes",
    title: "Your Parenting Belief Score",
    body: "Your number out of 100, the four dimensions behind it, and the moment your own answers keep circling back to.",
  },
  {
    Icon: FileText,
    meta: "Optional · after your score",
    title: "The full written breakdown",
    body: "The complete document: the possible belief your words point to, where the loop begins, and the point where you may have more choice than it feels like.",
  },
  {
    Icon: Route,
    meta: "Optional · when you want to go further",
    title: "The AI Merge program",
    body: "The guided path for parents who would rather work a pattern than read about one.",
  },
];

/* Block VI: prior professional work behind AI Merge. Pedigree, NOT
   endorsement — the disclaimer under the row states this, and it is mandatory
   whenever the strip is shown at all.

   Still flagged as a CRO A/B arm ("present vs. removed", hypothesis
   neutral-to-negative for a parenting audience, implied-endorsement risk on
   Meta). Flip to false to ship the removed arm. */
const SHOW_LOGO_STRIP = true;
const TRUST_LOGOS = [
  { src: "/logos/ibm.png", alt: "IBM" },
  { src: "/logos/microsoft.png", alt: "Microsoft" },
  { src: "/logos/tmobile.png", alt: "T-Mobile" },
  { src: "/logos/pearson.png", alt: "Pearson" },
  { src: "/logos/un.png", alt: "United Nations" },
];

/* Block VI: participant quotes.

   Both are from the broader AI Merge work, and the disclaimer under the cards
   says exactly that rather than implying they came from this free score.

   Chosen against one hard filter: each describes a shift the SPEAKER noticed
   in THEMSELVES. Nothing here claims another person changed — a parenting
   testimonial promising a child would behave differently would break the
   product's central claim on the one section meant to make it believable.

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

/* The line under every primary CTA. The measured completion figure is ten
   minutes, confirmed by the owners. */
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
 *  a two-clause Fraunces headline, and an optional lede in the right column.
 *
 *  The lede is deliberately used sparingly now. A headline that needs a
 *  paragraph to land is a headline that has not landed. */
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
  /** Right-column lede. One sentence, or nothing. */
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
        {/* The two clauses are separate block spans rather than raw text plus
            a span: without the wrapper they concatenate with no whitespace in
            the accessible name and in any text extraction, even though the
            visual line break makes it look correct. */}
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
          this page renders the questions accordion, the VSL, and the steps they
          describe. The FAQ entities are generated from the same lib/faq.ts
          array the accordion renders, so markup and visible copy cannot drift
          apart. */}
      <PageStructuredData
        name="Free Parenting Belief Score"
        path={ROUTES.home.path}
        description="Your child tells you less every year. See what may be shaping your side of the distance, in about 10 minutes. A free, personalised Parenting Belief Score built from your own words - reflective and educational, not a diagnosis, and not an assessment of your child."
        updated={ROUTES.home.updated}
        faqs={toFaqEntries(ESSENTIAL_FAQS)}
        speakableSelectors={["#hero-headline", "#score-heading"]}
        extraNodes={[videoNode, howToNode, publicationNode]}
      />
      <LandingAnalytics />

      <main id="main" className="relative flex-1">
        {/* The page's lighting. Both layers cost no layout and no JS:
            `.ambient-field` is a document-anchored column of very faint radial
            sources that scrolls with the content it lights, and
            `.page-vignette` is viewport-fixed so the vignette hugs the screen
            edge at every scroll position. Both sit at z-index -1. */}
        <div className="ambient-field" aria-hidden />
        <div className="page-vignette" aria-hidden />

        {/* ====================== Hero ======================
            Chip, headline, one line, VSL, CTA. Nothing else.

            The headline is the loss stated in the words a parent uses in their
            own head, not the words a product uses about itself. It is the
            whole reason the rest of the page gets read, so it carries no
            qualifier, no mechanism, and no brand vocabulary. */}
        <section id="hero" className="relative overflow-hidden">
          {/* One large soft orb centred behind the headline. Capped at 100vw in
              CSS so it can never add document width on a narrow phone. */}
          <div className="spotlight-hero" aria-hidden />
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-7 pt-8 text-center sm:px-8 sm:pb-10 sm:pt-16">
            <Reveal>
              <p className="cred-chip">
                For parents of teens and young adults
              </p>
            </Reveal>
            <Reveal delay={80}>
              {/* The whole hero argument, in nine words.

                  It names the two people this page is about (you, your kids)
                  and the one thing the visitor already feels (they are moving
                  away), and it does it in their vocabulary rather than the
                  product's. "Growing up / growing away" is the turn: the first
                  clause is the thing every parent accepts, the second is the
                  thing none of them planned for.

                  There is NO supporting paragraph under it, and that is
                  deliberate. Everything a subhead would have said is already
                  above the fold: the chip names the audience, the button names
                  the offer ("Get My Free Parenting Belief Score"), and the
                  microcopy under it carries the price, the length and the
                  effort. A paragraph here only delays the video and the
                  button, which are the two things that actually convert. */}
              <h1 id="hero-headline" className="text-display mt-6 sm:mt-8">
                Your kids are growing up.{" "}
                <span className="text-emphasis">
                  Are they growing away from you?
                </span>
              </h1>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal immediate>
              <VslPlayer />
            </Reveal>
            <Reveal delay={220}>
              <CtaBlock location="hero" className="mt-8" />
            </Reveal>
          </div>

          <Reveal delay={320}>
            <p className="mx-auto mt-8 max-w-4xl px-5 pb-16 text-center text-sm text-faint sm:px-8">
              Built on AI Merge, a methodology published in the{" "}
              <span className="text-muted">Mensa Research Journal</span>.
            </p>
          </Reveal>
        </section>

        {/* ================== I · The drift ==================
            The FOMO engine, and the only section allowed to dwell on the pain.

            It works by contrast: a photograph of the closeness that used to be
            automatic, beside a drawing of what replaced it. The drawing is the
            argument — distance is not an event, it is an accumulation — and it
            is drawn rather than described because "two lines that never meet
            again" is a shape, and prose is the worst carrier for a shape. */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="drift-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="drift_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="I · What is actually happening"
              id="drift-heading"
              lead="It never happens in one conversation."
              emphasis="It happens in a hundred ordinary ones."
            />

            <ChapterRule />

            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal as="figure" delay={150} className="min-w-0 lg:col-span-5">
                {/* signal-halo puts the glow BEHIND the frame so the photo sits
                    in the page's light rather than on top of it. The halo's
                    inset is vertical-only by design — see globals.css. */}
                <div className="signal-halo img-hover-zoom relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                  <Image
                    src="/new-assets/1.png"
                    alt="A parent outdoors being hugged by two young children."
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  {/* Scrim: the photograph is markedly lighter and warmer than
                      the navy ground, so without this it reads as a bright
                      rectangle pasted onto the page. */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--background) 10%, transparent) 0%, color-mix(in srgb, var(--background) 26%, transparent) 55%, color-mix(in srgb, var(--background) 82%, transparent) 100%)",
                    }}
                  />
                </div>
                <figcaption className="mt-4 text-center text-[12px] uppercase tracking-[0.16em] text-faint">
                  When closeness was the default
                </figcaption>
              </Reveal>

              <Reveal as="div" delay={220} className="min-w-0 lg:col-span-7">
                <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                  At six, you knew everything about their day.
                </p>
                <p className="mt-3 font-serif-italic text-2xl leading-snug text-ink sm:text-3xl">
                  At sixteen, you get three words and a closed door.
                </p>
                <p className="mt-6 text-lg leading-[1.8] text-muted">
                  Nobody tells you which year it changes. It just does - one
                  ordinary exchange at a time, until the distance is simply how
                  things are.
                </p>
              </Reveal>
            </div>

            {/* The accumulation, drawn. Full width: it is the section's
                argument, not an illustration beside it. */}
            <div className="mt-14 sm:mt-16">
              <ClosenessDrift />
            </div>

            <Reveal delay={200}>
              <p className="mx-auto mt-14 max-w-2xl text-center font-serif-italic text-xl leading-[1.5] text-ink sm:text-2xl">
                By the time it is obvious, the pattern that built it is years
                old.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <CtaBlock location="drift" className="mt-10" />
            </Reveal>
          </div>
        </section>

        {/* ================== II · The pattern ==================
            The page's hinge, and the section that answers the objection the
            visitor arrived with. Two objections are granted as true, the
            question is narrowed to the parent's own pattern, and the loop is
            drawn. Everything after this depends on the reader accepting this
            framing, so it is short and it does not argue. */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="pattern-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="pattern_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="II · The part you can change"
              id="pattern-heading"
              lead="You cannot rewind their teenage years."
              emphasis="You can change what happens next time you speak."
            >
              <p className="text-lg leading-[1.8] text-muted">
                So the Parenting Belief Score looks at one thing only: your own
                pattern in one real moment.
              </p>
              <p className="mt-4 font-serif-italic text-xl text-ink">
                It examines you, not your child.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* The two objections, granted rather than argued with. One line
                each: granting an objection needs one line, arguing needs
                three, and this page is not arguing here. */}
            <ul className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                "But the situation with my child is real.",
                "I’m not trying to control anything. I just want to stay close.",
              ].map((objection, i) => (
                <Reveal as="li" key={objection} delay={150 + i * 80}>
                  <blockquote className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface px-5 py-4">
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

            {/* The mechanism, drawn: concern drives intervention, intervention
                hides the counter-evidence, the missing evidence feeds the
                concern. A shape, again, so it is a drawing again. */}
            <Reveal delay={200}>
              <div className="mt-12 sm:mt-14">
                <BeliefLoop />
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-[1.8] text-muted">
                This is not about caring less. It is about the same care costing
                you - and them - less.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <CtaBlock location="pattern" className="mt-10" />
            </Reveal>
          </div>
        </section>

        {/* ================== III · The score ==================
            The section the brief was written for.

            A parent is being asked to spend ten minutes describing a private
            family moment in exchange for a number. Before that trade can look
            worth making, the number has to MEAN something — so this section
            does nothing else: what a low score says, what a high score says,
            where the scale sits, and what the four dimensions read. */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="score-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="score_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="III · Your score"
              id="score-heading"
              lead="One number for the thing"
              emphasis="you cannot see yourself."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Describe one real moment in your own words. Your score places
                how much of that moment you are actually choosing.
              </p>
            </ChapterHead>

            <ChapterRule />

            <Reveal delay={150}>
              <ScoreArch />
            </Reveal>

            <Reveal delay={150}>
              <div className="hairline-anim hairline my-12 sm:my-16" />
            </Reveal>

            <Reveal delay={150}>
              <p className="eyebrow mb-7">
                <span className="mr-3 inline-block h-px w-6 align-middle bg-line-strong" />
                The four things your score reads
              </p>
            </Reveal>

            {/* The one place the page spends colour beyond the teal --signal:
                four categorical hues, one per dimension, each paired with an
                icon and a text label so colour is never the only encoding. */}
            <ul className="grid list-none gap-4 sm:grid-cols-2 sm:gap-5">
              {PILLAR_ORDER.map((key, i) => (
                <Reveal as="li" key={key} delay={i * 80}>
                  <PillarDial dimension={key} value={SAMPLE_SUBSCORES[key]} />
                </Reveal>
              ))}
            </ul>

            <Reveal delay={220}>
              <CtaBlock location="score" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ================== IV · What arrives ==================
            The free score is the offer; the breakdown and the program are
            named as things that exist afterwards. No price appears on this
            page — that is the funnel's job — and nothing here implies they are
            included. The small print under the list is the document's own
            wording and is not optional. */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="arrives-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="what_arrives_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="IV · What arrives"
              id="arrives-heading"
              lead="Your score is on screen"
              emphasis="before you close the tab."
            />

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* The artifacts. Two real captures overlapped so the result
                  reads as an object you receive rather than a screen you
                  glance at. Both show the parent-facing surface only — no
                  child assessment, and no belief hypothesis, which may never be
                  shown unless it belongs to a consented participant. */}
              <Reveal as="figure" delay={150} className="min-w-0 lg:col-span-5">
                <div className="relative mx-auto w-full max-w-md">
                  <span aria-hidden className="take-halo" />
                  <div className="take-back relative w-[88%] origin-bottom-left">
                    <div className="overflow-hidden rounded-md border border-line shadow-[var(--elev-3)]">
                      <Image
                        src="/take/reportpdf.jpg"
                        alt="A page from the detailed written breakdown, composed around the parent's own answers."
                        width={1920}
                        height={1200}
                        sizes="(max-width: 1024px) 60vw, 30vw"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                  {/* Negative margin overlaps the cards; absolute positioning
                      left too much vertical dead space at narrow widths. -9%,
                      not the -18% this composition used with a wide 4:3 back
                      card: the breakdown capture is nearly square, and the
                      deeper overlap buried its score ring and first two
                      pillars — the part that makes it read as a result rather
                      than as a generic document. */}
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

              <div className="min-w-0 lg:col-span-7">
                <ol className="grid list-none grid-cols-1">
                  {WHAT_ARRIVES.map(({ Icon, meta, title, body }, i) => (
                    <Reveal
                      as="li"
                      key={title}
                      delay={i * 90}
                      className="row-interactive flex items-start gap-4 border-t border-line py-6 last:border-b sm:gap-6 sm:py-7"
                    >
                      <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-card">
                        <Icon
                          className="h-4 w-4 text-signal"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] uppercase tracking-[0.14em] text-faint">
                          {meta}
                        </span>
                        <span className="mt-1.5 block font-serif text-xl leading-snug text-ink sm:text-2xl">
                          {title}
                        </span>
                        <span className="mt-2 block text-[15px] leading-[1.75] text-muted">
                          {body}
                        </span>
                      </span>
                    </Reveal>
                  ))}
                </ol>

                <Reveal delay={200}>
                  <p className="mt-6 text-sm leading-relaxed text-faint">
                    Your Parenting Belief Score is free and complete on its own.
                    You are never required to buy anything to receive it.
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <CtaBlock location="what_arrives" className="mt-10" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* V · The walkthrough — the real assessment screens, so the ask has a
            visible shape before the visitor commits. */}
        <WalkthroughSection />

        {/* ================== VI · Who built it ==================
            Founder, credentials, prior work and participant quotes, merged
            into ONE trust section. They were three sections and three separate
            scroll-stops making one point between them. */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="founder-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="founder_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="VI · Who built it"
              id="founder-heading"
              lead="I could see the moment."
              emphasis="I could not see what was driving it."
            />

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal as="div" delay={150} className="min-w-0 lg:col-span-4">
                {/* Cropped square by the container (object-cover, top-weighted
                    so the crop takes the face rather than centring on the
                    torso) rather than letterboxed or distorted. */}
                <figure className="mx-auto w-full max-w-[400px]">
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
                <div className="space-y-5 text-[1.05rem] leading-[1.85] text-muted">
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
                  {/* As an icon grid each claim is countable at a glance and
                      the block stops being a wall of prose beside a portrait.
                      Same four facts, nothing added. */}
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
              </Reveal>
            </div>

            {/* Participant quotes.

                No stock portraits beside them: a face next to a quote from
                someone who is not that person is manufactured proof, and this
                audience is precisely the one that would feel it. So the visual
                is typography — an oversized quote glyph and a coloured rule.

                TODO(launch): replace with consented PARENT quotes as soon as
                they exist. Priority order: recognised their own pattern ·
                identified a useful possible belief · made one
                participant-controlled choice · repeated a different response ·
                became less dependent on external guidance. Never use a
                testimonial that promises child change. */}
            <ul className="mt-14 grid list-none gap-5 sm:mt-16 md:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <Reveal as="li" key={t.name} delay={i * 80}>
                  <figure
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-7 pt-8 sm:p-8 sm:pt-9"
                    style={{
                      // --signal, never a pillar hue. The pillar palette is
                      // CATEGORICAL: each colour identifies one scored
                      // dimension and nothing else, so spending teal and violet
                      // on quote cards would make teal mean "Direction
                      // Clarity" in one section and "first testimonial" here.
                      borderColor:
                        "color-mix(in srgb, var(--signal) 28%, var(--border))",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-0.5 bg-signal"
                      style={{ opacity: 0.65 }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[9rem] leading-none text-signal"
                      style={{ opacity: 0.1 }}
                    >
                      &rdquo;
                    </span>
                    <blockquote className="text-title relative flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center gap-2.5 text-sm">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                      />
                      <span className="font-medium text-fg">{t.name}</span>
                      <span className="text-faint">· {t.role}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-faint">
                Individual experiences vary. These accounts reflect experiences
                across the broader AI Merge work rather than the free Parenting
                Belief Score, and do not guarantee that another participant will
                receive the same result.
              </p>
            </Reveal>

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

            <Reveal delay={200}>
              <CtaBlock location="founder" className="mt-14" />
            </Reveal>
          </div>
        </section>

        {/* ================== VII · Questions ================== */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="faq_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left rail: heading plus the four boundaries this page is built
                  on, as cards. Sticky on desktop so they stay beside whichever
                  question is open — which is the point: the four things a
                  cautious parent most wants settled are the four things they
                  should not have to open an accordion to find. */}
              <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
                <Reveal>
                  <p className="eyebrow mb-6">VII · Questions</p>
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

        {/* ================== The close ==================
            No image beside the button: anything next to the click target gives
            the eye a second place to stop. The photograph sits ABOVE the
            argument instead, as the payoff note the section is built to land
            on, and the copy makes a promise about the parent only — never
            about how a child will respond. */}
        <section
          className="relative overflow-hidden border-t border-line py-20 sm:py-28"
          aria-labelledby="final-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="final_cta_view" />
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <figure className="signal-halo img-hover-zoom relative mx-auto mb-10 aspect-[21/9] w-full max-w-2xl overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                <Image
                  src="/new-assets/2.png"
                  alt="A parent sitting with their children at home, in the middle of an ordinary afternoon."
                  fill
                  sizes="(max-width: 768px) 100vw, 42rem"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--background) 12%, transparent) 0%, color-mix(in srgb, var(--background) 30%, transparent) 55%, color-mix(in srgb, var(--background) 86%, transparent) 100%)",
                  }}
                />
              </figure>
            </Reveal>

            <Reveal delay={60}>
              <p className="eyebrow mb-6">
                <span className="pulse-dot mr-2.5" aria-hidden />A closing
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h2 id="final-heading" className="text-section">
                <WordReveal
                  segments={[
                    { kind: "text", text: "The next conversation is coming." },
                    { kind: "br" },
                    {
                      kind: "italic",
                      text: "You decide who shows up to it.",
                    },
                  ]}
                />
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mx-auto mt-8 max-w-xl text-body-lg text-muted">
                Five questions, your own words, your score immediately.
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

      <SiteFooter />
      <MobileStickyCta />
    </>
  );
}
