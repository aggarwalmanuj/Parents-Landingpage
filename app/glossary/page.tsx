import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { ScorecardCta } from "@/components/scorecard-cta";
import { definedTermSetNode } from "@/components/structured-data";
import { GLOSSARY_GROUPS, type GlossaryTerm } from "@/lib/glossary";
import { pageMetadata, relatedLinks } from "@/lib/seo";
import { slugify } from "@/lib/site";

// Marked up as a real <dl> with <dfn> defining instances, not styled <div>s.
// Definition lists are the HTML element extractors associate with definitions,
// and <dfn> marks the one authoritative occurrence of each term on the site.
// Paired with the DefinedTermSet JSON-LD below, that gives an answer engine a
// single unambiguous source for every invented term this site uses.

export const metadata: Metadata = pageMetadata({
  title: "Glossary",
  description:
    "Definitions of every term used by the Parenting Belief Score: possible belief, the loop, the moment to notice, the parent's pattern, and AI Merge.",
  route: "glossary",
});

// Flattened here rather than exported from lib/glossary.ts so the DefinedTerm
// JSON-LD can only contain terms this page actually renders a <dfn> for.
const ALL_TERMS: GlossaryTerm[] = GLOSSARY_GROUPS.flatMap((g) => g.terms);

export default function GlossaryPage() {
  return (
    <ContentPage
      route="glossary"
      title="Glossary"
      description="Definitions of the terms used by the Parenting Belief Score and the AI Merge methodology."
      extraNodes={[definedTermSetNode(ALL_TERMS)]}
      related={relatedLinks(
        "faq",
        "home",
        "aiDataDisclosure",
        "professionalDisclaimer"
      )}
      summary={
        <p>
          Every term this site uses, defined once. A{" "}
          <strong className="font-medium text-fg">possible belief</strong> here
          is a conclusion that a repeated parenting experience may have taught a
          parent to hold, inferred from a described pattern and treated as a
          hypothesis rather than a diagnosis. Definitions below cover the AI
          Merge vocabulary, the fields that make up a result, and the parenting
          terms used in a narrower sense across the site.
        </p>
      }
    >
      <nav
        aria-label="On this page"
        className="rounded-2xl border border-line bg-card p-6"
      >
        <h2 className="text-eyebrow text-faint">On this page</h2>
        <ul className="mt-3 grid list-none sm:grid-cols-2">
          {GLOSSARY_GROUPS.map((group) => (
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

      {GLOSSARY_GROUPS.map((group) => (
        <section key={group.heading}>
          <h2 id={slugify(group.heading)} className="text-headline scroll-mt-24">
            {group.heading}
          </h2>
          <p className="mt-3 text-faint">{group.intro}</p>

          <dl className="mt-8 space-y-6">
            {group.terms.map((entry) => (
              <div
                key={entry.term}
                className="border-t border-line pt-6 first:border-t-0 first:pt-0"
              >
                <dt>
                  {/* <dfn> marks the defining instance. The id makes each term
                      independently linkable and matches its DefinedTerm @id. */}
                  <dfn
                    id={slugify(entry.term)}
                    className="text-title scroll-mt-24 not-italic"
                  >
                    {entry.term}
                  </dfn>
                </dt>
                <dd className="mt-3">
                  <p>{entry.definition}</p>
                  {entry.related && entry.related.length > 0 && (
                    <p className="mt-3 text-sm text-faint">
                      See also:{" "}
                      {entry.related.map((r, i) => (
                        <span key={r}>
                          {i > 0 && ", "}
                          <a
                            href={`#${slugify(r)}`}
                            className="underline underline-offset-4 transition-colors hover:text-fg"
                          >
                            {r}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="rounded-2xl border border-line bg-card p-7 text-center sm:p-9">
        <h2 className="text-title">See these terms in your own words</h2>
        <p className="mt-3">
          The free score takes one parenting moment you already know well and
          reflects it back as the fields defined above.
        </p>
        <div className="mt-6 flex justify-center">
          <span className="cta-halo">
            <ScorecardCta variant="signal" size="lg" location="glossary_page">
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
