import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { ScorecardCta } from "@/components/scorecard-cta";
import { FAQ_GROUPS, toFaqEntries, type Faq } from "@/lib/faq";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { slugify } from "@/lib/site";

// Without this page the site is a single doorway: every answer lives inside a
// collapsed accordion on "/", and nothing on the domain answers "what IS a
// parenting belief score" in a form an answer engine can lift and cite.
//
// This page is the citation surface. Questions render EXPANDED rather than in
// an accordion: <details> content is crawlable, but an extractor has to decide
// whether hidden text is page content, and a visible answer removes that
// judgment call entirely. Every question is an anchored <h3>, so an assistant
// citing this page can deep-link to the exact passage it quoted.

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Direct answers on the free Parenting Belief Score: what it examines, why it looks at the parent's pattern and not the child's, how it differs from therapy or parenting advice, and what it costs.",
  route: "faq",
});

/** One question. `h3` inside the group's `h2` keeps the outline linear, and the
 *  id makes every answer independently citable. */
function Question({ faq }: { faq: Faq }) {
  const id = slugify(faq.q);
  return (
    <div className="border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 id={id} className="text-title scroll-mt-24">
        {faq.q}
      </h3>
      <div className="mt-3 space-y-3">
        {faq.a.map((paragraph, i) => (
          <p key={i} className={i === 0 ? "text-fg" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

const GROUPS = FAQ_GROUPS;

// Derived here rather than exported from lib/faq.ts so the JSON-LD can only
// ever contain questions this page actually renders. FAQ_GROUPS already opens
// with the essential set, so a flatten is the complete visible corpus.
const ALL_FAQ_PAGE_FAQS: Faq[] = GROUPS.flatMap((group) => group.faqs);

export default function FaqPage() {
  return (
    <ContentPage
      route="faq"
      title="Frequently Asked Questions"
      description="Direct answers about the free Parenting Belief Score: what it examines, why it looks at your own pattern rather than your child, how it sits alongside support you already have, and how your information is handled."
      // Every visible question below is in the markup, and every answer in the
      // markup is visible below. That equivalence is the whole reason both are
      // generated from lib/faq.ts.
      faqs={toFaqEntries(ALL_FAQ_PAGE_FAQS)}
      related={relatedLinks(
        "glossary",
        "aiDataDisclosure",
        "professionalDisclaimer",
        "privacy"
      )}
      summary={
        <p>
          The{" "}
          <strong className="font-medium text-fg">
            Parenting Belief Score
          </strong>{" "}
          is a free, personalised reflection built from your own description of
          one real parenting moment. It examines your own pattern &mdash; your
          interpretation, meaning, response, and recurring loop &mdash; and it
          does not assess, score, or diagnose your child. It is reflective and
          educational, not diagnosis, treatment, or medical, psychological,
          legal, or family-therapy services, and it requires no credit card.
        </p>
      }
    >
      {/* On-page jump list. Gives the page an internal link graph of its own,
          and gives a reader on a phone a way past the full question set. */}
      <nav
        aria-label="On this page"
        className="rounded-2xl border border-line bg-card p-6"
      >
        <h2 className="text-eyebrow text-faint">On this page</h2>
        <ul className="mt-3 grid list-none sm:grid-cols-2">
          {GROUPS.map((group) => (
            <li key={group.heading}>
              {/* min-h-11: standalone in-page navigation, so WCAG 2.5.8 applies
                  (an inline link inside a sentence would be exempt). The dot
                  moves inside the anchor so the whole row is the tap target. */}
              <a
                href={`#${slugify(group.heading)}`}
                className="flex min-h-11 items-center gap-2.5 text-muted transition-colors hover:text-fg"
              >
                <span className="list-dot shrink-0" aria-hidden />
                {group.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {GROUPS.map((group) => (
        <section key={group.heading}>
          <h2 id={slugify(group.heading)} className="text-headline scroll-mt-24">
            {group.heading}
          </h2>
          <p className="mt-3 text-faint">{group.intro}</p>
          <div className="mt-8 space-y-6">
            {group.faqs.map((faq) => (
              <Question key={faq.q} faq={faq} />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-line bg-card p-7 text-center sm:p-9">
        <h2 className="text-title">Still deciding?</h2>
        <p className="mt-3">
          The clearest way to see what the score does is to run it on one
          parenting moment you already know well.
        </p>
        <div className="mt-6 flex justify-center">
          <span className="cta-halo">
            <ScorecardCta variant="signal" size="lg" location="faq_page">
              Get My Free Parenting Belief Score
            </ScorecardCta>
          </span>
        </div>
        <p className="mt-4 text-sm text-faint">
          Free · Personalised · No credit card · Reflective, not diagnostic
        </p>
      </section>
    </ContentPage>
  );
}
