import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Our commitment to an accessible experience: WCAG 2.2 AA target, measures taken, known limitations, and how to reach us.",
  route: "accessibility",
});

export default function AccessibilityPage() {
  return (
    <ContentPage
      route="accessibility"
      title="Accessibility"
      description="Our commitment to an accessible experience: WCAG 2.2 AA target, measures taken, known limitations, and how to reach us."
      related={relatedLinks("faq", "glossary", "privacy", "terms")}
    >
        <section>
          <h2 className="text-title">Our commitment</h2>
          <p className="mt-3">
            TetraNoodle Technologies wants everyone, including people with
            cognitive differences and visual, auditory, or motor
            disabilities, to be able to use this site. We aim to conform to
            the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA,
            consistent with the Americans with Disabilities Act (ADA), the
            Accessible Canada Act, and comparable international standards.
          </p>
        </section>
        <section>
          <h2 className="text-title">Measures we take</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Semantic HTML landmarks, a logical heading order, and a skip-to-content link.</li>
            <li>Full keyboard operability, with a visible high-contrast focus indicator.</li>
            <li>Color contrast checked against the WCAG AA thresholds.</li>
            <li>Text that scales with browser zoom and pinch-zoom left enabled on mobile.</li>
            <li>Captions displayed on the video, which never autoplays with sound.</li>
            <li>Reduced-motion support: animations and autoplay are disabled when your device requests reduced motion.</li>
            <li>Touch targets of at least 44 pixels on interactive controls.</li>
            <li>Alternative text on informative images.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-title">Known limitations</h2>
          <p className="mt-3">
            The video&rsquo;s captions are currently embedded in the picture
            rather than provided as a separate, screen-reader-adjustable
            caption track, and no audio-description track is available yet.
            We are working to improve this. Third-party services linked from
            this site (including the assessment itself) are covered by their
            own accessibility practices.
          </p>
        </section>
        <section>
          <h2 className="text-title">Feedback and assistance</h2>
          <p className="mt-3">
            If you encounter an accessibility barrier on this site, or need
            any part of it in an alternative format, contact us at{" "}
            <a
              className="font-medium text-fg underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            . Please describe the problem and the page it occurred on. We
            aim to respond within five business days.
          </p>
        </section>
    </ContentPage>
  );
}
