import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "AI and Data Disclosure",
  description:
    "How artificial intelligence is used in the Parenting Belief Score, what information it processes, and the limits of what it can tell you.",
  route: "aiDataDisclosure",
});

export default function AiDataDisclosurePage() {
  return (
    <ContentPage
      route="aiDataDisclosure"
      title="AI and Data Disclosure"
      description="How artificial intelligence is used in the Parenting Belief Score, what information it processes, and the limits of what it can tell you."
      related={relatedLinks("privacy", "professionalDisclaimer", "glossary", "faq")}
    >
        <section>
          <h2 className="text-title">Where AI is used</h2>
          <p className="mt-3">
            The Parenting Belief Score uses artificial intelligence to help
            organise the information you choose to provide about one parenting
            moment. The system helps connect what you describe: what happened,
            what the moment began to mean to you, how you responded, and how
            the loop may keep reinforcing itself. The result you receive is
            generated with the assistance of AI, based on your own words.
          </p>
        </section>
        <section>
          <h2 className="text-title">AI-generated avatar and voice</h2>
          <p className="mt-3">
            The video on this site uses an AI-generated avatar and voice of
            Manuj Aggarwal. The words and methodology are his; the on-screen
            presenter is synthesized.
          </p>
        </section>
        <section>
          {/* The child boundary belongs in this section specifically: a reader
              worried about AI is worried about what it inferred, and the
              honest answer is that it never looked at the child at all. */}
          <h2 className="text-title">The AI never examines your child</h2>
          <p className="mt-3">
            The system does not assess, score, evaluate, or diagnose your
            child. It does not infer your child&rsquo;s thoughts, feelings,
            intentions, capability, development, health, or behaviour, and it
            makes no prediction about your child&rsquo;s future. Every field in
            your result describes something you did, interpreted, or felt. A
            result that read like an assessment of your child would be outside
            the scope of this tool.
          </p>
        </section>
        <section>
          <h2 className="text-title">What the AI does not do</h2>
          <p className="mt-3">
            The system does not independently know your family. It does not
            access your messages, photos, calendar, school or medical records,
            or any other account or device unless a future product explicitly
            requests and discloses such access. It does not evaluate your
            competence or worth as a parent, and it does not decide what is
            true about you: the result is a possible interpretation offered for
            your reflection, and you remain the authority on your own
            parenting.
          </p>
          <p className="mt-3">
            The AI is a supporting instrument, not the authority. It cannot
            read your mind, it does not know your child, and it does not decide
            what fits. You do.
          </p>
        </section>
        <section>
          <h2 className="text-title">Limitations of AI-generated content</h2>
          <p className="mt-3">
            AI-generated reflections can be incomplete, imprecise, or simply
            wrong. Treat your result as a hypothesis to examine, refine,
            accept, or reject, not as a factual statement about you or your
            family. Do not make medical, psychological, developmental,
            educational, legal, or financial decisions based on it. Belief is
            never the sole cause: development, circumstances, personality,
            health, finances, history and culture are all real and all matter.
            See the{" "}
            <Link
              href="/professional-disclaimer"
              className="font-medium text-fg underline underline-offset-4"
            >
              Professional Services Disclaimer
            </Link>{" "}
            for the full boundaries.
          </p>
          <p className="mt-3">
            Where immediate safety, severe distress, or a clinical concern is
            present, seek support from an appropriate qualified professional or
            emergency service rather than from this tool.
          </p>
        </section>
        <section>
          <h2 className="text-title">How your information is handled</h2>
          {/* LAUNCH-BLOCKING. Storage, retention, human review, and
              model-training are legal claims, and parents are describing
              private family moments here, so an invented answer is worse than
              a visible gap. Identical placeholder to app/privacy/page.tsx and
              lib/faq.ts; the three must ship word-for-word identical. */}
          <p className="mt-3">
            [INSERT APPROVED PRIVACY, STORAGE, HUMAN-REVIEW AND MODEL-TRAINING
            WORDING]
          </p>
          {/* TODO(launch): replace the bracketed line above with the approved
              legal text, verified against live operating practice, vendor
              configuration, the model-training policy, the human-review
              policy, and retention/deletion procedures. Do NOT add claims that
              information is never reviewed, never shared, never sold, or
              excluded from AI training unless those statements are verified
              and approved. Confirm the wording matches app/privacy/page.tsx
              and the two placeholder answers in lib/faq.ts exactly. */}
          <p className="mt-3">
            For collection, your rights, and how to request access or deletion,
            see the{" "}
            <Link
              href="/privacy"
              className="font-medium text-fg underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="text-title">Human oversight</h2>
          {/* Same launch block: lib/faq.ts carries "[INSERT APPROVED
              HUMAN-REVIEW WORDING]" for the matching question, and the spec
              requires the two to be identical. */}
          <p className="mt-3">[INSERT APPROVED HUMAN-REVIEW WORDING]</p>
          {/* TODO(launch): must match the "Is a human involved, or is this only
              AI?" answer in lib/faq.ts exactly. Do not ship divergent wording. */}
          <p className="mt-3">
            What we can state now without qualification: the experience is
            designed so that you, the participant, make the final judgment
            about what is true for you. If a result ever feels harmful or
            clearly wrong, contact us at{" "}
            <a
              className="font-medium text-fg underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>{" "}
            so we can review it.
          </p>
        </section>
        <section>
          <h2 className="text-title">Changes</h2>
          <p className="mt-3">
            If how we use AI or handle data changes materially, we will update
            this page and revise the date above.
          </p>
        </section>
    </ContentPage>
  );
}
