import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that govern your use of this website and the free Parenting Belief Score.",
  route: "terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      route="terms"
      title="Terms of Use"
      description="The terms that govern your use of this website and the free Parenting Belief Score."
      related={relatedLinks("privacy", "professionalDisclaimer", "faq", "aiDataDisclosure")}
    >
        <section>
          <h2 className="text-title">The free Parenting Belief Score</h2>
          <p className="mt-3">
            The Parenting Belief Score is free and creates no obligation on
            either side. No credit card is required. You receive your complete
            free result before any optional paid offer is presented; any paid
            next step is optional.
          </p>
        </section>
        <section>
          <h2 className="text-title">Who this is for</h2>
          <p className="mt-3">
            This site and the Parenting Belief Score are intended for parents
            and other adult caregivers. They are not designed or intended for
            use by children. Describe only what you are comfortable describing,
            and only what you need in order to describe the moment.
          </p>
        </section>
        <section>
          <h2 className="text-title">No professional advice</h2>
          <p className="mt-3">
            AI Merge provides educational and reflective tools. Nothing on this
            site is medical, psychological, mental-health, developmental,
            educational, legal, or financial advice, and nothing here is
            psychotherapy, counselling, family therapy, or crisis support.
            Nothing here diagnoses or treats any condition, in you or in anyone
            else. See the{" "}
            <Link
              href="/professional-disclaimer"
              className="font-medium text-fg underline underline-offset-4"
            >
              Professional Services Disclaimer
            </Link>
            . Consult a qualified professional where that is what you need.
          </p>
          <p className="mt-3">
            Where immediate safety, severe distress, or a clinical concern is
            present, seek support from an appropriate qualified professional or
            emergency service.
          </p>
        </section>
        <section>
          {/* The single hardest boundary on the site: a reader must not be able
              to leave this page believing the score said something about their
              child. Stated here as a term of use, not only as a disclaimer. */}
          <h2 className="text-title">It examines your pattern, not your child</h2>
          <p className="mt-3">
            The Parenting Belief Score examines your own interpretation,
            meaning, response, and recurring loop in one parenting moment you
            choose to describe. It does not assess, score, evaluate, or
            diagnose your child, and it makes no claim about what your child
            thinks, feels, intends, or is capable of.
          </p>
        </section>
        <section>
          <h2 className="text-title">Your result</h2>
          <p className="mt-3">
            Your result is a hypothesis offered for reflection, not a finding
            about you, your child, your family, your ability, or your value.
            Keep what fits; correct, refine, question, or reject what does not.
            Belief is never presented as the sole cause of anything that
            happens in your family - development, circumstances,
            personality, health, finances, history and culture are all real.
            You remain responsible for the decisions you make as a parent.
          </p>
        </section>
        <section>
          <h2 className="text-title">No promised outcome</h2>
          <p className="mt-3">
            Nothing on this site promises more contact, improved performance,
            greater independence, better behaviour, different decisions, or any
            other change in a child or in a relationship.
          </p>
        </section>
        <section>
          <h2 className="text-title">Acceptable use</h2>
          <p className="mt-3">
            Don&apos;t abuse the site: no scraping, no automated submissions,
            no attempts to access other people&apos;s data. We may remove
            entries that look fraudulent.
          </p>
        </section>
        <section>
          <h2 className="text-title">Intellectual property</h2>
          <p className="mt-3">
            AI Merge and the Parenting Belief Score are proprietary
            intellectual property created by Manuj Aggarwal and operated by
            TetraNoodle Technologies. Your own result is yours to use.
          </p>
        </section>
        <section>
          <h2 className="text-title">Liability</h2>
          <p className="mt-3">
            The site is provided as-is. To the maximum extent permitted by
            law, our total liability for any claim related to the site is
            limited to the amount you paid us in the preceding 12 months.
          </p>
        </section>
        <section>
          <h2 className="text-title">Contact</h2>
          <p className="mt-3">
            Questions? Email{" "}
            <a
              className="font-medium text-fg underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
    </ContentPage>
  );
}
