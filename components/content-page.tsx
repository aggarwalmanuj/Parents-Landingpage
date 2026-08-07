// Shared shell for every non-doorway route (FAQ, glossary, and the legal set).
//
// Why it exists:
// 1. BreadcrumbList JSON-LD must not ship without a VISIBLE breadcrumb on the
//    page. Google's breadcrumb guidance expects the markup to describe a trail
//    the reader can actually see, so the trail is rendered here and the markup
//    is generated from the same props.
// 2. Sub-pages would otherwise be dead ends: header CTA out, footer legal
//    links, nothing else. Sub-pages cross-link through `related`, which turns
//    isolated URLs into a small hub-and-spoke cluster and gives crawlers a
//    reason to reach the FAQ and glossary from anywhere on the site.
// 3. The "Last updated" line, the sitemap's lastmod, and the JSON-LD
//    `dateModified` all read one entry in lib/site.ts instead of three
//    hand-typed dates that drift.

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  PageStructuredData,
  type FaqEntry,
} from "@/components/structured-data";
import { ROUTES, formatUpdated, type RouteKey } from "@/lib/site";

export type RelatedLink = { href: string; label: string; blurb: string };

export function ContentPage({
  route,
  title,
  description,
  /** One or two sentences directly answering "what is this page". Rendered as
   *  the lede and reused as the JSON-LD description, so the passage an answer
   *  engine quotes is the same one a reader sees first. */
  summary,
  faqs,
  extraNodes,
  related,
  children,
}: {
  route: RouteKey;
  title: string;
  description: string;
  summary?: React.ReactNode;
  faqs?: FaqEntry[];
  extraNodes?: object[];
  related?: RelatedLink[];
  children: React.ReactNode;
}) {
  const { path, updated } = ROUTES[route];

  return (
    <>
      <SiteHeader />
      <PageStructuredData
        name={title}
        path={path}
        description={description}
        updated={updated}
        faqs={faqs}
        extraNodes={extraNodes}
        speakableSelectors={summary ? ["#page-summary"] : undefined}
      />
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 sm:py-16"
      >
        {/* Visible trail. aria-current marks the leaf for screen readers; the
            separator is decorative so it is never announced. */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex list-none flex-wrap items-center gap-2 text-faint">
            <li>
              {/* min-h-11: a standalone navigation link, so it needs a real
                  tap target rather than the 17px the text alone gives it. */}
              <Link
                href="/"
                className="inline-flex min-h-11 items-center transition-colors hover:text-fg"
              >
                Home
              </Link>
            </li>
            <li aria-hidden className="select-none">
              /
            </li>
            <li>
              <span aria-current="page" className="text-muted">
                {title}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="text-headline mt-6">{title}</h1>
        <p className="mt-2 text-sm text-faint">
          Last updated: {formatUpdated(updated)}
        </p>

        {summary && (
          <div
            id="page-summary"
            className="text-body-lg mt-7 border-l-2 border-signal pl-5 leading-relaxed text-muted"
          >
            {summary}
          </div>
        )}

        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:text-fg">
          {children}
        </div>

        {related && related.length > 0 && (
          <aside
            aria-labelledby="related-heading"
            className="mt-16 border-t border-line pt-10"
          >
            <h2 id="related-heading" className="text-title">
              Related pages
            </h2>
            <ul className="mt-5 grid list-none gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="liftable flex h-full flex-col rounded-2xl border border-line bg-card px-5 py-4 transition-colors hover:border-line-strong"
                  >
                    <span className="font-medium text-fg">{item.label}</span>
                    <span className="mt-1.5 text-sm text-faint">
                      {item.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
