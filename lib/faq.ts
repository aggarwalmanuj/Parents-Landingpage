// Canonical FAQ copy for the Parenting Belief Score doorway.
//
// Why this is data and not JSX: the essential answers would otherwise exist
// TWICE, once as JSX in app/page.tsx and once as strings in the FAQPage
// JSON-LD, with nothing keeping them in sync. Google treats FAQ markup that
// diverges from visible page content as spam, and an answer engine that quotes
// a sentence a reader cannot find on the page learns to distrust the domain.
// Rendering the accordion AND generating the markup from this one array makes
// divergence structurally impossible.
//
// Writing rules for every entry here, tuned for answer engines:
// - The first paragraph must stand alone as a complete answer. It is what gets
//   lifted into an AI Overview, a featured snippet, or a voice result, with no
//   surrounding context to lean on.
// - Lead with the verdict ("No.", "Yes.") where the question is a yes/no.
// - Name entities explicitly instead of using pronouns ("the Parenting Belief
//   Score", not "it") so a quoted fragment stays unambiguous.
//
// Copy constraints from the Parents landing-page spec that apply here:
// the score examines the PARENT's pattern and never the child's; it is not
// diagnosis or professional service; belief is never the sole cause; AI is
// never the authority; no promised child outcome. Completion time is stated as
// "about 10 minutes" — the measured figure confirmed by the owners, which
// replaces the spec's [VERIFIED TIME] slot.

export type Faq = {
  q: string;
  /** Paragraphs. The first must be a self-contained direct answer. */
  a: string[];
};

export type FaqGroup = {
  heading: string;
  /** Short lede under the group heading on /faq. */
  intro: string;
  faqs: Faq[];
};

/** Flatten to the {question, answer} shape the FAQPage JSON-LD builder wants. */
export const toFaqEntries = (faqs: Faq[]) =>
  faqs.map((f) => ({ question: f.q, answer: f.a.join(" ") }));

/**
 * The seven "Questions parents ask" rendered on the landing page itself
 * (spec Block 12), verbatim from the approved copy. These are the entries
 * that also generate the homepage FAQPage JSON-LD.
 */
export const ESSENTIAL_FAQS: Faq[] = [
  {
    q: "Is this about me or my child?",
    a: [
      "It's about your own pattern as a parent - your interpretation, meaning, response, and recurring loop in one parenting moment.",
      "The Parenting Belief Score does not assess, score, or diagnose your child, and it won't tell you what they think, feel, intend, or are capable of.",
    ],
  },
  {
    q: "Is this a diagnosis or a professional service?",
    a: [
      "No. The Parenting Belief Score is an educational and reflective tool - not diagnosis, treatment, or medical, psychological, legal, or family-therapy services.",
      "Parenting is shaped by development, circumstances, personality, health, finances, history and culture. The score examines one possible layer: what may be shaping your own response.",
    ],
  },
  {
    q: "Is the Parenting Belief Score really free?",
    a: [
      "Yes. You receive your personalised Parenting Belief Score free, with no credit card required.",
      "Afterward, you may be offered an optional detailed breakdown and personalised Action Plan. You're never required to buy anything to get your score.",
    ],
  },
  {
    q: "What happens with the information I provide?",
    a: [
      // LAUNCH-BLOCKING per the spec. People are describing private family
      // moments here; an unanswered data question stops exactly the cautious,
      // reflective visitor this product is built for. Do not ship placeholder
      // wording — replace with the approved legal text before launch.
      "[INSERT APPROVED PRIVACY, STORAGE, HUMAN-REVIEW AND MODEL-TRAINING WORDING]",
    ],
  },
  {
    q: "Will this tell me how to make my child change?",
    a: [
      "No. The Parenting Belief Score doesn't promise more contact, improved performance, greater independence, or different decisions.",
      "It focuses on the part of the moment available to you.",
    ],
  },
  {
    q: "What if the result feels inaccurate?",
    a: [
      "Treat it as a hypothesis, not a verdict. Accept part of it, reject it, or refine it.",
      "Technology helps organise what you provide and suggest a possible pattern - it cannot read your mind, it doesn't know your child, and it doesn't decide what's true. You decide what fits.",
    ],
  },
  {
    q: "How does this fit with support I'm already getting?",
    a: [
      "Keep what helps. Parenting education offers practical strategies. Therapy helps with emotional, relational and clinical concerns. A counselor, physician, financial adviser or school professional helps with circumstances needing their expertise.",
      "The Parenting Belief Score examines a different layer - the meaning and response forming inside your own moment. It can help you enter those conversations clearer about what may be yours, and what may not be.",
    ],
  },
];

/**
 * The expanded corpus rendered on /faq. Group one repeats the landing page's
 * essential set (so the dedicated page is self-sufficient for an answer engine
 * that only crawls /faq); the later groups go deeper than the landing page has
 * room for.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "The essentials",
    intro:
      "The questions parents ask before they begin, answered the same way they are answered on the landing page.",
    faqs: ESSENTIAL_FAQS,
  },
  {
    heading: "What the score examines",
    intro:
      "What a Parenting Belief Score looks at, what it deliberately leaves alone, and how to read the result.",
    faqs: [
      {
        q: "What is a Parenting Belief Score?",
        a: [
          "A Parenting Belief Score is a free, personalised reflection built from your own description of one real parenting moment.",
          "It reflects back what happened, what it began to mean to you, how you responded, the loop that keeps the pattern in place, and the moment where more choice may exist. It is built on AI Merge, a methodology published in the Mensa Research Journal.",
        ],
      },
      {
        q: "What does 'it examines your pattern, not your child's' actually mean?",
        a: [
          "It means every field in your result describes something you did, interpreted, or felt - never something your child is.",
          "The score does not infer your child's state, motives, or capability. A result that reads like an assessment of your child would be outside what this tool does.",
        ],
      },
      {
        q: "Does a belief cause everything that happens in my family?",
        a: [
          "No. Belief is one layer among many, and never presented as the sole cause.",
          "Development, circumstances, personality, health, finances, history and culture are all real and all matter. The score examines the one layer that is most available to you in the moment: the meaning forming inside your own response.",
        ],
      },
      {
        q: "What is the 'loop' in my result?",
        a: [
          "The loop is the self-sustaining part of a pattern: concern drives intervention, intervention hides what would have happened without it, and the missing evidence feeds the concern again.",
          "Naming the loop is what makes the pattern visible. Once you can see where it closes, you can see where it might open.",
        ],
      },
      {
        q: "How long does it take?",
        a: [
          // The measured figure, confirmed by the owners. It must stay
          // identical to the CTA microcopy in app/page.tsx: a visitor who reads
          // "about 10 minutes" under the button and a different number here
          // learns the page is careless with exactly the kind of small factual
          // claim this product asks them to trust.
          "About 10 minutes. Five questions about one moment, answered in your own words.",
          "You receive your personalised result immediately afterward. Some people take longer because they want to sit with a question - that is fine, and nothing expires while you think.",
        ],
      },
    ],
  },
  {
    heading: "Method, technology, and limits",
    intro:
      "How the result is produced, what the technology does, and where its authority ends.",
    faqs: [
      {
        q: "What is AI Merge?",
        a: [
          "AI Merge is the methodology behind the Parenting Belief Score, created by Manuj Aggarwal and published in the Mensa Research Journal.",
          "It helps people make repeated patterns visible so they can respond with greater clarity and choice.",
        ],
      },
      {
        q: "Is a human involved, or is this only AI?",
        a: [
          "[INSERT APPROVED HUMAN-REVIEW WORDING]",
          "TODO(launch): this must match the AI and Data Disclosure page exactly. Do not ship divergent wording.",
        ],
      },
      {
        q: "Why does the result say 'possible belief' rather than telling me what I believe?",
        a: [
          "Because the result is a hypothesis built from a short description you provided, not a measurement of you.",
          "You remain the authority on your own parenting. The wording stays conditional because the honest claim is conditional.",
        ],
      },
      {
        q: "Is this a personality test?",
        a: [
          "No. There is no type, label, or archetype in a Parenting Belief Score.",
          "It describes one specific recurring moment you chose to write about - not a stable trait you carry.",
        ],
      },
    ],
  },
  {
    heading: "Safety and support",
    intro:
      "Where this tool stops, and what to reach for instead.",
    faqs: [
      {
        q: "What if I'm worried about my child's immediate safety?",
        a: [
          "Where immediate safety, severe distress, or a clinical concern is present, seek support from an appropriate qualified professional or emergency service.",
          "The Parenting Belief Score is an educational and reflective tool and is not a crisis service.",
        ],
      },
      {
        q: "Should I stop working with my therapist or counselor?",
        a: [
          "No. Keep what helps.",
          "The Parenting Belief Score is designed to sit alongside existing support, not replace it. Many people find it helps them enter those conversations clearer about what may be theirs, and what may not be.",
        ],
      },
    ],
  },
];
