import Image from "next/image";
import {
  Award,
  BookOpen,
  Building2,
  Check,
  FileText,
  Gauge,
  HeartHandshake,
  Lock,
  MessageSquareText,
  PenLine,
  Route,
  ShieldCheck,
  UserRoundCheck,
  X,
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
import { PerceptionGap } from "@/components/visuals/perception-gap";
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
   A North American parent of a TEENAGER, arriving cold from paid social, who
   has noticed the closeness draining out of the relationship, takes the free
   Parenting Belief Score. The objection in their head on arrival is "this is
   going to tell me I'm the problem".

   NARRATIVE (v5 — the teen-messaging update)
   Hero (audience, loss, offer, click) -> I recognition, in their own words ->
   II the perception gap -> III what the score IS -> IV how it works -> V what
   the number means -> VI what arrives -> VII the product walked through ->
   VIII who built it -> IX the questions -> close.

   WHAT CHANGED IN v5 AND WHY, so it does not get "fixed" back:
   - AUDIENCE. The page said "your kids" and "12-25 year olds". It now says
     teenagers, in the H1, in the metadata, and in every section's copy. A
     visitor must be able to tell in one second that this page is about them.
   - The hero gained back the three things it was missing: a line saying what
     the offer IS (the free 5-question score), a credibility line, and a CTA
     ABOVE the video rather than below it. The VSL stays, under the button.
   - II is new: the perception gap, and the CDC figures behind it. It is the
     page's only statistic and it is stated with its limits attached, because
     the whole product rests on a parent being willing to believe a small
     factual claim.
   - IV is new: three steps, plainly. The walkthrough (VII) shows the real
     screens, but a visitor deciding whether to start needs the shape of the
     ask before they will scroll that far.
   - IX's left rail is now the five reassurances a cautious parent needs
     settled, each answered "No." — was four abstract "boundary" cards.

   REGISTER — unchanged, and non-negotiable:
   - The free Parenting Belief Score is the ONLY offer on this page. The
     written breakdown and the AI Merge program are named as things that exist
     afterwards; pricing is discovered on the funnel, not here. Nothing on this
     page may imply they are included, and nothing may imply the score is
     anything other than free.
   - It examines THE PARENT'S pattern, never the child's. No section may
     assess, score, diagnose, or infer the state of a teenager.
   - Educational and reflective — not diagnosis, treatment, or medical,
     psychological, legal, or family-therapy services.
   - Belief is never the sole cause. Development, circumstances, personality,
     health, finances, history and culture stay explicitly real.
   - HEDGED VERBS ONLY where the product's claim is hedged: "may be shaping",
     "may be influencing", "help surface", "make visible", "examine". Never
     "uncover the belief", never "this will repair your relationship", never
     anything that claims to know what a teenager thinks or feels.
   - The urgency on this page is the real one (a child grows up once, and the
     habits compound), stated as recognition. No countdowns, no invented
     scarcity, no promised child outcome.
========================================================================== */

/* Block I: the recognition set. These are the sentences parents actually use,
   and they are deliberately NOT presented as a checklist, a symptom list, or
   anything a reader is meant to score themselves against — the footnote under
   them says so in as many words. Their only job is "this page is about me". */
const RECOGNITION = [
  "We used to talk about everything.",
  "Now I feel like I’m walking on eggshells.",
  "I give them space, but they seem even farther away.",
  "I try to help, and somehow it turns into an argument.",
  "I don’t understand why the same conversations keep going wrong.",
];

/* Block IV: the three steps, in the order they happen. Kept deliberately
   plain — no graphic, no screenshots. The walkthrough in VII is where the real
   screens live; this is the shape of the ask, for a visitor who has not
   decided to scroll that far yet. */
const STEPS = [
  {
    Icon: PenLine,
    n: "1",
    title: "Describe one real moment",
    body: "Tell us about an interaction with your teenager, in your own words. One moment, not your whole relationship.",
  },
  {
    Icon: MessageSquareText,
    n: "2",
    title: "Answer 5 personalised questions",
    body: "Built from what you just described, to explore what may be happening underneath your immediate response.",
  },
  {
    Icon: Gauge,
    n: "3",
    title: "Receive your Parenting Belief Score",
    body: "See the belief or pattern your answers surface, and how it may relate to the interaction you described.",
  },
];

/* Block IV, the clarifier under the steps. Two columns, because the objection
   a parent arrives with is answered faster by a list of what this ISN'T than
   by another paragraph explaining what it is. */
const SCORE_IS = [
  "Personalised to the one moment you describe",
  "Built from your own words, not a questionnaire",
  "Focused on your side of the interaction",
];
const SCORE_IS_NOT = [
  "Not an assessment of your teenager",
  "Not a diagnosis, and not therapy",
  "Not a parenting course",
  "Not a verdict on whether you are a good parent",
];

/* Block VI: what arrives, in the order it arrives.

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

/* Block VIII: prior professional work behind AI Merge. Pedigree, NOT
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

/* Block VIII: participant quotes.

   Both are from the broader AI Merge work, and the disclaimer under the cards
   says exactly that rather than implying they came from this free score.

   Chosen against one hard filter: each describes a shift the SPEAKER noticed
   in THEMSELVES. Nothing here claims another person changed — a parenting
   testimonial promising a teenager would behave differently would break the
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

/* Block IX: the five things a cautious parent wants settled before they will
   type a private family moment into a stranger's website. Each is answered
   "No." on purpose: the question a visitor is actually asking is a yes/no, and
   a hedged answer to it reads as a yes.

   Tinted in --signal rather than the four --pillar-N hues. Those four colours
   identify the four SCORED DIMENSIONS and nothing else on this page; spending
   them here would make teal mean "Direction Clarity" in one section and "your
   child is not being assessed" in another. */
const REASSURANCES = [
  {
    Icon: UserRoundCheck,
    q: "Is this evaluating my child?",
    a: "No. It looks at you, and at the interaction you describe in your own words.",
  },
  {
    Icon: HeartHandshake,
    q: "Is this a diagnosis?",
    a: "No. It is not a medical or psychological diagnosis, and it is not treatment.",
  },
  {
    Icon: Lock,
    q: "Does my teenager have to take part?",
    a: "No. Your teenager never needs to participate, and never needs to know.",
  },
  {
    Icon: BookOpen,
    q: "Is this another parenting course?",
    a: "No. It is a short personalised assessment of one real interaction.",
  },
  {
    Icon: ShieldCheck,
    q: "Will I be judged?",
    a: "No. The goal is curiosity and reflection, not a grade on your parenting.",
  },
];

/* The line under every primary CTA.

   Five constraints, not three. The two added ones are not filler: "looks at
   you, not your child" and "no diagnosis" answer the exact objection this
   page's own brief names as the one in a visitor's head on arrival ("this is
   going to tell me I'm the problem"). Putting them ON the button is what stops
   that objection surviving all the way to the click.

   REBASE NOTE: this is main's default (b92f83e), kept as the default. The
   teen-narrative branch had carried a shorter default plus a hero-specific
   override with exactly this string; with main's version global, that override
   was redundant and is gone. Only the close still differs — see below. */
const CTA_MICROCOPY =
  "Free · About 10 minutes · No credit card · Looks at you, not your child · No diagnosis";
/* The close is the one place the reassurance changes, because the objection
   live at that point is different: a visitor who has read the whole page is no
   longer asking "is this about my child?" but "do I have to involve them?". */
const CTA_MICROCOPY_FINAL =
  "5 questions · About 10 minutes · Free · No credit card · Your teen never needs to participate";

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
      {/* px-2 + balance: at 390px the dot-separated clauses ran the full width
          and broke against the viewport edge. Balancing splits them into even
          lines instead of ragged ones. */}
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
  return (
    <>
      {/* LCP preload, desktop only.

          The hero video's poster is the largest element in the initial viewport
          on DESKTOP, and a `poster` attribute is only discovered once the
          <video> is parsed and browsers fetch posters at low priority — so
          without a hint it loses the race to assets that matter less.

          On a phone it is a different picture entirely, and that is the traffic
          this page is bought for. The hero stacks a statistic, a two-line
          display headline, a subhead, a credibility line and the button above
          the player, so at 412x915 the poster is well below the fold while the
          LCP element is the headline. Fetching 63 KB at `fetchPriority: high`
          there does not make anything visible sooner; it takes bandwidth from
          the font, the stylesheet and the JavaScript that do, on the one
          connection they all share.

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
          this page renders the questions accordion, the VSL, and the steps they
          describe. The FAQ entities are generated from the same lib/faq.ts
          array the accordion renders, so markup and visible copy cannot drift
          apart. */}
      <PageStructuredData
        name="Free Parenting Belief Score"
        path={ROUTES.home.path}
        description="Losing the closeness you had with your teenager? See what may be shaping your side of it, in about 10 minutes. A free, personalised Parenting Belief Score built from your own words - reflective and educational, not a diagnosis, and not an assessment of your teenager."
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
            qualifier, no mechanism, and no brand vocabulary.

            Every Reveal above the fold carries `priority`, which swaps the
            JS-gated transition for a CSS keyframe. Without it the entire hero
            sits at opacity 0 until the client bundle downloads, parses and
            hydrates — invisible on a cold mobile connection, and disqualified
            from being the LCP element until that moment lands. This was fixed
            once (238b387) and lost in the merge at dd0cd3c; it must not be
            lost again. */}
        <section id="hero" className="relative overflow-hidden">
          {/* One large soft orb centred behind the headline. Capped at 100vw in
              CSS so it can never add document width on a narrow phone. */}
          <div className="spotlight-hero" aria-hidden />
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-5 pt-6 text-center sm:px-8 sm:pb-10 sm:pt-16">
            <Reveal priority>
              {/* V4 eyebrow. Names the brand and the offer, so the chip that is
                  the first line on the page says what this IS. The audience is
                  no longer needed here - the headline's own first six words
                  ("For parents of teens and young adults") carry it. */}
              {/* The brand chip, restored. The CDC perception-gap statistic
                  (76.9% of parents vs 27.5% of teens, NCHS report No. 206)
                  briefly led here and was pulled pending sign-off: the figures
                  are accurate and were verified against the primary source,
                  but citing a federal health agency above the fold of a paid
                  funnel is a compliance decision, not a copy one - it invites
                  an implied-endorsement reading and extra ad-review scrutiny.

                  Everything else from that revision stays. The headline no
                  longer has the stat setting it up, so it now carries the
                  recognition on its own, which is why it opens by naming the
                  audience.

                  TODO: re-add above the headline if compliance approves. The
                  full treatment is in git history at b92f83e.

                  REBASE NOTE (this branch): the teen-narrative work had
                  restored a compressed form of the statistic here, as a
                  bordered stat block reading "CDC · NCHS data / 76.9% … 27.5%".
                  It is deliberately NOT reinstated: 8c73e5f is a compliance
                  decision held pending sign-off, and it postdates that work.
                  The same two figures DO still appear below the fold in
                  Section II with the full NCHS citation, sample sizes and
                  mode-effect caveat — that section is flagged for the same
                  sign-off, because it is the same agency being cited on the
                  same paid funnel, just not above the fold. */}
              <p className="cred-chip">
                AI Merge · Free Parenting Belief Score
              </p>
            </Reveal>
            <Reveal priority delay={80}>
              {/* Headline: Option 1.

                  It follows the stat rather than competing with it. The stat
                  says the gap is real and common; this says "and it may be
                  yours", in the words a parent uses in their own head
                  ("losing the closeness you used to have") rather than the
                  product's.

                  "Parents of teens" opens it so the audience is named before
                  the worry is, which keeps a visitor who is NOT the audience
                  from reading a question aimed at someone else. */}
              <h1 id="hero-headline" className="text-display mt-5 sm:mt-8">
                Parents of teens: worried you&rsquo;re losing{" "}
                <span className="text-emphasis">
                  the closeness you used to have?
                </span>
              </h1>
            </Reveal>
            <Reveal priority delay={140}>
              {/* The promise. Names the mechanism (a hidden belief), the cost
                  (five questions), and the moment it applies to - the one the
                  reader is already thinking about after the headline.

                  The four marker names that used to sit here are gone. They
                  were product vocabulary arriving before the reader had agreed
                  there was a problem; they are still named further down the
                  page, on the dials, where a reader who has agreed will meet
                  them. */}
              <p className="mt-4 max-w-2xl text-balance text-[16px] leading-[1.65] text-muted sm:mt-6 sm:text-body-lg sm:leading-[1.75]">
                Take the free 5-question Parenting Belief Score to uncover a
                hidden belief that may be shaping how you respond in the very
                moments you most want your teen to open up.
              </p>
            </Reveal>
            <Reveal priority delay={190}>
              {/* Proof line.

                  "Documented changes already observed in real participants" is
                  deliberately NOT here. This page's own proof section states
                  plainly that no parent testimonials exist yet, and a claim of
                  documented change above the fold would contradict it three
                  screens later. The published methodology is verifiable today;
                  the participant claim is not, so it waits.

                  TODO(launch): if the documented-change evidence exists and can
                  be cited, this line can carry it.

                  REBASE NOTE (this branch): the teen-narrative work had this
                  line carrying ", with changes documented among participants in
                  the broader AI Merge work". It is deliberately NOT reinstated —
                  b92f83e rejected exactly that claim above the fold, for the
                  reason stated above, and that rejection postdates the work.
                  Flagged for owner decision rather than silently resolved. */}
              <p className="mt-4 hidden max-w-2xl text-balance text-[15px] leading-[1.7] text-faint sm:block">
                Built on AI Merge, a personalised methodology published in the{" "}
                <span className="text-muted">Mensa Research Journal</span>.
              </p>
            </Reveal>
          </div>

          {/* REBASE NOTE: the CTA sits BELOW the player, which is main's order
              (b92f83e / 8c73e5f). The teen-narrative branch had moved it above
              the player to keep it inside the first screen — but that was
              compensating for the CDC stat block this hero no longer carries.
              With the stat gone, main's order is the verified one, and git's
              auto-merge had silently dropped this CtaBlock entirely by taking
              the branch's player-only div. Do not remove it again. */}
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

        {/* ================== I · Recognition ==================
            The FOMO engine, and the only section allowed to dwell on the pain.

            Three moves: the sentences parents actually say (so the visitor
            knows the page is about them), the before-and-after (so the loss has
            a shape), and the accumulation drawn (so it reads as a pattern
            rather than an event). */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="drift-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="drift_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="I · If any of this sounds familiar"
              id="drift-heading"
              lead="It never happens in one conversation."
              emphasis="It happens in a hundred ordinary ones."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Parents of teenagers describe it in different words. Usually it
                sounds like one of these.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* Recognition, not diagnosis. No icons, no checkmarks, no ticks:
                anything that reads as a list to score yourself against turns a
                parent's "that's me" into "what's wrong with us", which is the
                one reaction this page cannot afford. */}
            <ul className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
              {RECOGNITION.map((line, i) => (
                <Reveal
                  as="li"
                  key={line}
                  delay={100 + i * 70}
                  className={
                    // Five items in a two-column grid leaves an orphan; the
                    // last one spans both so the row reads as intentional.
                    i === RECOGNITION.length - 1 ? "sm:col-span-2" : undefined
                  }
                >
                  <blockquote className="h-full rounded-xl border border-line bg-card px-5 py-4 font-serif-italic text-[17px] leading-snug text-ink sm:text-lg">
                    &ldquo;{line}&rdquo;
                  </blockquote>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={200}>
              <p className="mt-6 text-sm leading-relaxed text-faint">
                These are things parents say, not symptoms to check off. None of
                them is a sign that something is wrong with your teenager.
              </p>
            </Reveal>

            <div className="mt-14 grid items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
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

        {/* ================== II · The perception gap ==================
            The page's one statistic, and the section that makes the case that
            a parent cannot audit this from the inside.

            The claim is bounded on purpose and the visual's caption bounds it
            again: two groups answering separately, not matched households, and
            therefore nothing at all about the visitor's own family. Overstate
            this section and every careful sentence elsewhere on the page stops
            being believed. */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="gap-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="gap_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="II · The perception gap"
              id="gap-heading"
              lead="You were both in the same conversation."
              emphasis="You did not both have the same experience of it."
            >
              <p className="text-lg leading-[1.8] text-muted">
                This is not a failure of love or attention. It is the part of a
                relationship neither side can see from where they are standing.
              </p>
            </ChapterHead>

            <ChapterRule />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="min-w-0 lg:col-span-7">
                <PerceptionGap />
              </div>

              <Reveal as="div" delay={150} className="min-w-0 lg:col-span-5">
                {/* Both sentences name WHO was asked WHAT. The parents were
                    asked about their own named teenager; the teenagers were
                    asked about themselves. Collapsing that into "asked the same
                    question" would quietly turn a proxy report into a second
                    self-report, which is the specific error this section has
                    to avoid. */}
                <p className="text-lg leading-[1.8] text-muted">
                  Asked how often their own teenager gets the social and
                  emotional support they need, 76.9% of parents answered
                  &ldquo;always&rdquo;. Asked the same question about
                  themselves, 27.5% of teenagers did.
                </p>
                <p className="mt-5 text-lg leading-[1.8] text-muted">
                  That does not mean most parents are wrong about their own
                  child, and it cannot tell you anything about yours. Some of
                  the distance is in how the two groups were surveyed. But the
                  part that is not is worth sitting with: the read a parent has
                  of the relationship and the experience a teenager is having of
                  it can sit a long way apart - quietly, and without anyone
                  doing a thing wrong.
                </p>
                <p className="mt-6 font-serif-italic text-xl leading-snug text-ink sm:text-2xl">
                  A gap you cannot see is a gap you cannot close.
                </p>
              </Reveal>
            </div>

            <Reveal delay={260}>
              <CtaBlock location="gap" className="mt-14" />
            </Reveal>
          </div>
        </section>

        {/* ================== III · What the score is ==================
            The page's hinge, and the section that answers the objection the
            visitor arrived with. Two objections are granted as true, the
            question is narrowed to the parent's own pattern, and the loop is
            drawn. Everything after this depends on the reader accepting this
            framing, so it is short and it does not argue. */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="pattern-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="pattern_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="III · What the score is"
              id="pattern-heading"
              lead="You cannot rewind their teenage years."
              emphasis="You can change what happens next time you speak."
            >
              <p className="text-lg leading-[1.8] text-muted">
                So the Parenting Belief Score asks five personalised questions
                about one real interaction, and helps surface a belief that may
                be influencing how you respond to it.
              </p>
              <p className="mt-4 font-serif-italic text-xl text-ink">
                It examines you, not your teenager.
              </p>
            </ChapterHead>

            <ChapterRule />

            {/* The two objections, granted rather than argued with. One line
                each: granting an objection needs one line, arguing needs
                three, and this page is not arguing here. */}
            <ul className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                "But the situation with my teenager is real.",
                "I’m not trying to control anything. I just want to stay close.",
              ].map((objection, i) => (
                <Reveal as="li" key={objection} delay={150 + i * 80}>
                  <blockquote className="flex h-full items-start gap-3 rounded-xl border border-line bg-card px-5 py-4">
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

        {/* ================== IV · How it works ==================
            Three steps and two lists. Deliberately the plainest section on the
            page: a visitor who is still deciding needs the SHAPE of the ask,
            and every graphic here would be one more thing between them and the
            button. The real screens are in VII for whoever wants them. */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="how-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="how_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="IV · How it works"
              id="how-heading"
              lead="Three steps,"
              emphasis="about ten minutes."
            />

            <ChapterRule />

            <ol className="grid list-none gap-5 md:grid-cols-3 md:gap-6">
              {STEPS.map(({ Icon, n, title, body }, i) => (
                <Reveal as="li" key={n} delay={i * 90}>
                  <div className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 sm:p-7">
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-card">
                        <Icon
                          className="h-4 w-4 text-signal"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <span className="font-serif text-2xl leading-none text-signal">
                        {n}
                      </span>
                    </span>
                    <span className="mt-5 block font-serif text-xl leading-snug text-ink sm:text-2xl">
                      {title}
                    </span>
                    <span className="mt-2.5 block text-[15px] leading-[1.75] text-muted">
                      {body}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* The clarifier. A parent's objection is answered faster by a
                list of what this is NOT than by another paragraph about what
                it is — and every line on the right is one a visitor would
                otherwise have to open the FAQ to settle. */}
            <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 md:gap-6">
              <Reveal delay={100}>
                <div className="h-full rounded-xl border border-line bg-surface p-6 sm:p-7">
                  <p className="eyebrow mb-5">What it is</p>
                  <ul className="grid list-none gap-3">
                    {SCORE_IS.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check
                          className="mt-1 h-4 w-4 shrink-0 text-signal"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span className="min-w-0 text-[15px] leading-[1.7] text-muted">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="h-full rounded-xl border border-line bg-surface p-6 sm:p-7">
                  <p className="eyebrow mb-5">What it is not</p>
                  <ul className="grid list-none gap-3">
                    {SCORE_IS_NOT.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        {/* Faint, not red. These are boundaries, not errors —
                            a destructive hue here would read as a warning
                            about the product rather than a clarification. */}
                        <X
                          className="mt-1 h-4 w-4 shrink-0 text-faint"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span className="min-w-0 text-[15px] leading-[1.7] text-muted">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={220}>
              <CtaBlock location="how" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ================== V · Your score ==================
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
              mark="V · Your score"
              id="score-heading"
              lead="One number for the thing"
              emphasis="you cannot see yourself."
            >
              <p className="text-lg leading-[1.8] text-muted">
                Describe one real moment with your teenager in your own words.
                Your score places how much of that moment you are actually
                choosing.
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

        {/* ================== VI · What arrives ==================
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
              mark="VI · What arrives"
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
                        src="/take/parents-05-plan.jpg"
                        alt="Page one of a Parenting Action Plan: the score, the pattern named in the parent's own terms, and the four dimensions each with a written reading."
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
                        src="/take/parents-04-summary.jpg"
                        alt="The result screen: a Parenting Belief Score out of 100, with the four dimensions listed beneath it."
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

        {/* VII · The walkthrough — the real assessment screens, so the ask has
            a visible shape before the visitor commits. */}
        <WalkthroughSection />

        {/* ================== VIII · Who built it ==================
            Founder, credentials, prior work and participant quotes, merged
            into ONE trust section, plus the plainest statement of what AI
            Merge actually is. */}
        <section
          className="relative overflow-hidden border-t border-line bg-surface py-16 sm:py-24 lg:py-28"
          aria-labelledby="founder-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="founder_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <ChapterHead
              mark="VIII · Who built it"
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
                  {/* What AI Merge IS, in one sentence a non-technical reader
                      can repeat. It sits here rather than in the hero because
                      the hero's job is the offer; this is the section where a
                      visitor has asked "but what is this, actually". */}
                  <p>
                    AI Merge is a personalised methodology for examining the
                    relationship between what a person believes, how they
                    interpret a moment, and how they respond to it. Changes have
                    been documented among participants in the broader AI Merge
                    work.
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
                testimonial that promises a change in a teenager. */}
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

        {/* ================== IX · Questions ================== */}
        <section
          className="relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="section-orbs" aria-hidden />
          <SectionViewTracker event="faq_view" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left rail: heading plus the five reassurances, as cards.
                  Sticky on desktop so they stay beside whichever question is
                  open — which is the point: the five things a cautious parent
                  most wants settled are the five things they should not have to
                  open an accordion to find. */}
              <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
                <Reveal>
                  <p className="eyebrow mb-6">IX · Questions</p>
                  <h2 id="faq-heading" className="text-section">
                    Questions
                    <span className="block font-serif-italic">parents ask.</span>
                  </h2>
                </Reveal>

                <ul className="mt-9 grid list-none gap-3">
                  {REASSURANCES.map(({ Icon, q, a }, i) => (
                    <Reveal as="li" key={q} delay={100 + i * 60}>
                      <div
                        className="flex items-start gap-3.5 rounded-xl border bg-card p-4"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--signal) 26%, var(--border))",
                        }}
                      >
                        <span
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-signal"
                          style={{
                            background:
                              "color-mix(in srgb, var(--signal) 14%, transparent)",
                          }}
                        >
                          <Icon
                            className="h-4 w-4"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-fg">
                            {q}
                          </span>
                          <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                            {a}
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
            about how a teenager will respond. */}
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
                If you miss feeling close to your teenager, start by examining
                what is happening on your side of the interaction.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <CtaBlock
                location="final"
                microcopy={CTA_MICROCOPY_FINAL}
                className="mt-10"
              />
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
