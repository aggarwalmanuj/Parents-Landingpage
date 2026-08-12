import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How AI Merge collects, uses, and protects your information, and how the private family moments described in a Parenting Belief Score are handled.",
  route: "privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      route="privacy"
      title="Privacy Policy"
      description="How AI Merge collects, uses, and protects your information, and how the private family moments described in a Parenting Belief Score are handled."
      related={relatedLinks("aiDataDisclosure", "terms", "faq", "professionalDisclaimer")}
    >
        <section>
          <h2 className="text-title">What we collect</h2>
          <p className="mt-3">
            This page is a doorway to the free Parenting Belief Score. On this
            site itself we record how you found us: the referring page, UTM
            campaign parameters, and ad click identifiers, so we know which
            channels are working. When you continue to the score, the five
            short answers you write there are collected in order to generate
            your personalised result.
          </p>
        </section>
        <section>
          {/* Parents describe real family moments in their own words, so the
              sensitivity of what is submitted has to be stated plainly rather
              than left for a reader to infer from a generic policy. */}
          <h2 className="text-title">What you are describing is sensitive</h2>
          <p className="mt-3">
            The Parenting Belief Score asks you to describe one real parenting
            moment. What you write is personal, and it may mention a child or
            another member of your family. Please share only what you are
            comfortable sharing, and only what you need in order to describe
            the moment - there is no benefit to including full names,
            addresses, schools, medical details, or anything else that
            identifies a child.
          </p>
          <p className="mt-3">
            The score is intended for parents and other adult caregivers. It is
            not designed or intended for use by children, and children should
            not submit answers here.
          </p>
        </section>
        <section>
          <h2 className="text-title">Analytics &amp; cookies</h2>
          <p className="mt-3">
            With your consent, we use PostHog for product analytics and
            session replay (with keyboard input masked) and the Meta Pixel for
            advertising measurement. These tools use cookies and local storage
            to distinguish visitors and only run after you accept them in the
            cookie banner; declining keeps them off. We also use Vercel
            Analytics, which is cookieless and collects no personal data. We
            use this data to improve the site and measure campaigns.
          </p>
        </section>
        <section>
          <h2 className="text-title">How your answers are used</h2>
          {/* LAUNCH-BLOCKING. This is the question a cautious parent asks
              before writing anything down, and the source document supplies a
              placeholder rather than approved wording. Storage, retention,
              human review, and model-training claims are legal claims: ship
              the approved text or ship nothing. See the same placeholder in
              lib/faq.ts ("What happens with the information I provide?") and
              on the AI and Data Disclosure page &mdash; all three must match. */}
          <p className="mt-3">
            [INSERT APPROVED PRIVACY, STORAGE, HUMAN-REVIEW AND MODEL-TRAINING
            WORDING]
          </p>
          {/* TODO(launch): replace the bracketed line above with the approved
              legal text, then confirm it is word-for-word identical in
              lib/faq.ts and app/ai-data-disclosure/page.tsx. Do NOT state that
              answers are never reviewed, never shared, never sold, retained
              for a fixed period, or excluded from model training unless legal
              has verified and approved each of those statements. */}
          <p className="mt-3">
            Your answers are used to generate your personalised Parenting
            Belief Score. For how AI is involved in producing that result, and
            what it cannot do, see the{" "}
            <Link
              href="/ai-data-disclosure"
              className="font-medium text-fg underline underline-offset-4"
            >
              AI and Data Disclosure
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="text-title">Your rights</h2>
          <p className="mt-3">
            You can request a copy of your data, correction, or deletion at
            any time by emailing{" "}
            <a
              className="font-medium text-fg underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            . We respond within 30 days. If you would like the description you
            submitted removed, say so and we will treat it as a deletion
            request.
          </p>
        </section>
        <section>
          <h2 className="text-title">Changes</h2>
          <p className="mt-3">
            If this policy changes materially we will note it here and revise
            the date above.
          </p>
        </section>
    </ContentPage>
  );
}
