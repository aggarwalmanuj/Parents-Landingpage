import type { Metadata } from "next";
import Link from "next/link";
import { ScorecardCta } from "@/components/scorecard-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LINKS } from "@/lib/seo";

// Next's built-in 404 inherits the root layout's metadata wholesale, so every
// missing URL would be served with `rel="canonical"` pointing at the homepage
// and the homepage's own description. A canonical on a 404 tells Google the
// missing page IS the homepage, which is exactly the wrong instruction; and the
// default 404 is also a dead end with no route back into the site.
//
// This replaces both problems: `canonical: null` drops the inherited tag,
// robots noindex keeps error URLs out of the index regardless of how a crawler
// treats the status code, and the recovery links give a lost visitor (and a
// crawler following a stale inbound link) a path back to real content.

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page does not exist. Find the free Parenting Belief Score, the FAQ, or the glossary instead.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

const RECOVERY = [LINKS.home, LINKS.faq, LINKS.glossary];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-20 sm:px-8 sm:py-28"
      >
        <p className="text-eyebrow text-signal">404</p>
        <h1 className="text-headline mt-4">This page does not exist</h1>
        <p className="text-body-lg mt-5 text-muted">
          The link may be out of date, or the address may have a typo. Here is
          where to go instead.
        </p>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2">
          {RECOVERY.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="liftable flex h-full flex-col rounded-2xl border border-line bg-card px-5 py-4 transition-colors hover:border-line-strong"
              >
                <span className="font-medium text-fg">{item.label}</span>
                <span className="mt-1.5 text-sm text-faint">{item.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-4">
          <span className="cta-halo w-full sm:w-auto">
            <ScorecardCta
              variant="signal"
              size="lg"
              location="not_found"
              className="w-full min-h-11 sm:w-auto"
            >
              Get My Free Parenting Belief Score
            </ScorecardCta>
          </span>
          <p className="text-center text-sm text-faint">
            Free · Personalised · No credit card · Reflective, not diagnostic
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
