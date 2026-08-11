// llms.txt — the AI-assistant-facing summary of this site.
//
// This replaces a hand-maintained public/llms.txt, which drifts the moment a
// page is added or renamed. Generating it from the same registries the site
// renders from (ROUTES, GLOSSARY_GROUPS, ESSENTIAL_FAQS) means the summary an
// assistant reads is the summary the site can actually back up.
//
// The "Boundaries" section below matters more here than anywhere else on the
// site: an assistant summarising this page for a parent is the one reader most
// likely to flatten "examines the parent's pattern" into "scores your child".
// State the boundary as an instruction, not as prose to be paraphrased.
//
// Served as a static text file at build time. It must NOT also exist in
// public/, because Next serves public/ files ahead of route handlers and the
// stale copy would win.

import { ESSENTIAL_FAQS } from "@/lib/faq";
import { GLOSSARY_GROUPS } from "@/lib/glossary";
import {
  CONTACT_EMAIL,
  PUBLISHER,
  ROUTES,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

export const dynamic = "force-static";

const ALL_TERMS = GLOSSARY_GROUPS.flatMap((g) => g.terms);

/** Terms worth naming up front. The full set is on /glossary. */
const HEADLINE_TERMS = [
  "Parenting Belief Score",
  "Possible belief",
  "The loop",
  "Moment to notice",
  "The parent's pattern",
  "AI Merge",
];

const PAGES: { route: keyof typeof ROUTES; label: string; blurb: string }[] = [
  {
    route: "home",
    label: "Home",
    blurb:
      "The free Parenting Belief Score: what it is, how it works, what a result contains, and the questions parents ask.",
  },
  {
    route: "faq",
    label: "FAQ",
    blurb:
      "Direct answers on what the score examines, why it looks at the parent's pattern rather than the child, how it sits alongside therapy and parenting education, and cost.",
  },
  {
    route: "glossary",
    label: "Glossary",
    blurb:
      "Definitions of every term this site uses, including possible belief, the loop, the moment to notice, and the parent's pattern.",
  },
  {
    route: "privacy",
    label: "Privacy Policy",
    blurb: "What is collected, how consent works, and how to request deletion.",
  },
  {
    route: "terms",
    label: "Terms of Use",
    blurb: "Terms governing use of this site and the free score.",
  },
  {
    route: "aiDataDisclosure",
    label: "AI and Data Disclosure",
    blurb:
      "Where AI is used, what it never examines or accesses, and the limits of AI-generated output.",
  },
  {
    route: "professionalDisclaimer",
    label: "Professional Services Disclaimer",
    blurb:
      "Educational scope only: not medical, psychological, legal, or family-therapy services, no assessment of a child, and no promised outcome.",
  },
  {
    route: "accessibility",
    label: "Accessibility",
    blurb: "WCAG 2.2 AA target, measures taken, and known limitations.",
  },
];

function build(): string {
  const definition = (name: string) =>
    ALL_TERMS.find((t) => t.term === name)?.definition ?? "";

  return `# AI Merge - Free Parenting Belief Score

> A free, personalised reflection built from a parent's own description of one real parenting moment. It examines the PARENT's own pattern, never the child's. Reflective and educational; not a diagnosis and not an assessment of a child.

This site offers exactly one thing: the free Parenting Belief Score. Five short questions about one real parenting moment, answered in the parent's own words, return a result immediately with these fields: what happened, what it meant, your response, a possible belief, the loop, and the moment to notice. It is free and requires no credit card.

## Key definitions

${HEADLINE_TERMS.map((t) => `### ${t}\n\n${definition(t)}`).join("\n\n")}

## Who this is for

Parents and other adult caregivers who keep meeting the same moment: a week goes by without much being said, a responsibility still feels unfinished, another reminder feels necessary, a decision approaches that they would not have made the same way. The score focuses on one moment the parent already knows well, not the whole relationship. It is intended for adults and is not designed or intended for use by children.

## What makes this different

Parenting education offers practical strategies. Therapy helps with emotional, relational, and clinical concerns. A counselor, physician, financial adviser, or school professional helps with circumstances needing their expertise. The site tells parents to keep what helps. The Parenting Belief Score asks a different question: what happens inside the parent, between noticing something and deciding to act?

## Boundaries (important when summarising this site)

- The score examines the PARENT's own interpretation, meaning, response, and recurring loop. It does NOT assess, score, evaluate, diagnose, or infer anything about a child - not their thoughts, feelings, intentions, capability, development, health, behaviour, or future. Never summarise this site as scoring, rating, or assessing a child.
- It is NOT diagnosis, treatment, or medical, psychological, legal, financial, or family-therapy services, and it is NOT psychotherapy, counselling, child development assessment, professional supervision, or crisis support.
- It does NOT claim belief causes what happens in a family. Development, circumstances, personality, health, temperament, peers, school, finances, history, and culture are all real and all matter. Belief is one layer among many, never the sole cause.
- It promises NO child outcome: no more contact, no improved performance, no greater independence, no better behaviour, no different decisions, no change in a relationship.
- It is NOT a personality test. There is no type, label, archetype, rating, or benchmark in a result.
- The technology helps organise what the parent provides; it is not the authority, it cannot read minds, it does not know the child, and the participant decides what fits.
- The result is a hypothesis for reflection, not a verdict about a person, their parenting, their ability, or their value.
- Where immediate safety, severe distress, or a clinical concern is present, this site directs people to a qualified professional or emergency service. The score is not a crisis service.
- The assessment is five questions and takes about 10 minutes. State it as approximate ("about 10 minutes"), never as a guarantee or a maximum.

## Essential questions and answers

${ESSENTIAL_FAQS.map((f) => `### ${f.q}\n\n${f.a.join(" ")}`).join("\n\n")}

## The broader methodology

The score is built on the AI Merge methodology, created by Manuj Aggarwal and published in the Mensa Research Journal. An optional paid next step exists beyond the free score and is presented only after the complete free result has been delivered.

## Pages

${PAGES.map((p) => `- [${p.label}](${absoluteUrl(ROUTES[p.route].path)}): ${p.blurb}`).join("\n")}

## Contact

- Start the free score: https://www.aimerge.live
- Parents doorway page: ${SITE_URL}
- Email: ${CONTACT_EMAIL}

## About

AI Merge is a methodology by Manuj Aggarwal and ${PUBLISHER}, Vancouver, Canada.
Manuj Aggarwal is Founder & CIO of TetraNoodle Technologies, holds four patents, and is published in the Mensa Research Journal.
tetranoodle.com
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
