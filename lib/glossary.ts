// Canonical definitions for the vocabulary this site invents or uses in a
// specific sense.
//
// Why this exists: the site invents vocabulary (Parenting Belief Score,
// possible belief, the loop, moment to notice) and an answer engine asked
// "what is a Parenting Belief Score?" needs one unambiguous, quotable
// definition to lift. Defining each term once, here, means the glossary page,
// the DefinedTerm JSON-LD, and any on-page usage all agree.
//
// Writing rules, same as lib/faq.ts: the definition must stand alone without
// surrounding context, must name the entity rather than say "it", and must not
// claim more than the spec allows. Specifically: the score examines the
// PARENT's pattern and never the child's; belief is never the sole cause; the
// participant remains the authority; nothing here promises a child outcome.

export type GlossaryTerm = {
  term: string;
  /** One self-contained paragraph. This is what gets quoted. */
  definition: string;
  /** Other terms in this glossary worth reading next. */
  related?: string[];
};

export type GlossaryGroup = {
  heading: string;
  intro: string;
  terms: GlossaryTerm[];
};

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    heading: "The core vocabulary",
    intro:
      "The terms this site uses in a specific sense, defined once so they mean the same thing everywhere they appear.",
    terms: [
      {
        term: "Parenting Belief Score",
        definition:
          "A free, personalised reflection built from a parent's own description of one real parenting moment. It reflects back what happened, what the moment began to mean, how the parent responded, the loop that keeps the pattern in place, and the point where more choice may exist. It examines the parent's own pattern and is reflective and educational rather than a diagnosis, a personality test, or an assessment of the child.",
        related: ["AI Merge", "Possible belief", "The loop"],
      },
      {
        term: "Possible belief",
        definition:
          "A conclusion a repeated parenting experience may have taught a parent to hold, such as “not stepping in is risky.” In the AI Merge methodology a possible belief is inferred from a described pattern of behaviour and treated as a hypothesis for the parent to examine, never as an established fact about them and never as a diagnosis. The wording stays conditional because the honest claim is conditional.",
        related: ["Parenting Belief Score", "The loop"],
      },
      {
        term: "The loop",
        definition:
          "The self-sustaining part of a parenting pattern: concern drives intervention, the intervention hides what would have happened without it, and the missing evidence feeds the concern again. Naming the loop is what makes a pattern visible — once a parent can see where it closes, they can see where it might open.",
        related: ["Moment to notice", "Possible belief"],
      },
      {
        term: "Moment to notice",
        definition:
          "The instant uncertainty becomes a reason to act, before checking what the facts actually support. It is deliberately narrow: not the whole relationship and not every conversation, but the single earliest observable point where the familiar response begins, chosen so a parent can realistically catch it.",
        related: ["The loop"],
      },
      {
        term: "AI Merge",
        definition:
          "The methodology behind the Parenting Belief Score, created by Manuj Aggarwal and published in the Mensa Research Journal. It combines AI-supported pattern recognition with a human-first approach in which the technology helps organise a described pattern and the participant retains authority over what the pattern means. AI Merge helps people make repeated patterns visible so they can respond with greater clarity and choice.",
        related: ["Parenting Belief Score"],
      },
    ],
  },
  {
    heading: "Terms from the parenting context",
    intro:
      "Everyday words this site uses in a narrower sense than usual, and the boundary each one marks.",
    terms: [
      {
        term: "Reflective tool",
        definition:
          "A tool intended to support a person's own thinking rather than to measure, diagnose, certify, or advise. The Parenting Belief Score is a reflective tool: it produces a hypothesis for the parent to accept, refine, question, or reject, and it is not medical, psychological, legal, financial, family-therapy, or other professional advice.",
        related: ["Parenting Belief Score"],
      },
      {
        term: "The parent's pattern",
        definition:
          "The interpretation, meaning, response, and recurring loop belonging to the parent in one specific parenting moment. Every field in a Parenting Belief Score result describes something the parent did, interpreted, or felt. The score does not assess, score, or diagnose the child, and it does not infer the child's thoughts, feelings, intentions, or capabilities.",
        related: ["Parenting Belief Score"],
      },
      {
        term: "Intervention",
        definition:
          "Any response a parent makes to reduce their own uncertainty about a situation — another reminder, a piece of advice, a better option offered, a question asked again. On this site intervention is treated as one of the observable behaviours a repeated parenting moment may produce, not as a fault in the parent's care or judgment.",
        related: ["The loop"],
      },
      {
        term: "Missing evidence",
        definition:
          "What a parent never gets to observe because they stepped in first: how the situation would have unfolded without the reminder, the advice, or the intervention. Missing evidence is what allows a concern to persist unchallenged, because nothing ever arrives to contradict it.",
        related: ["The loop"],
      },
    ],
  },
];
