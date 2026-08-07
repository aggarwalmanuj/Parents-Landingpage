// Single source of truth for the deployed public origin of this site.
// Everything SEO-facing (canonical/metadataBase, robots Host + Sitemap,
// sitemap <loc> URLs, and the JSON-LD @id/url graph) derives from this so the
// domain can never drift across files again.
//
// Set to the live Parenting Belief Score doorway domain. This is
// intentionally NOT the parent brand (www.aimerge.live) or the scorecard
// destination (aimerge.live/challenge/...), which stay distinct on purpose.
// TODO(launch): confirm this is the approved production domain.
export const SITE_URL = "https://parents.aimerge.live";

/** Brand suffix used by the title template and the og/twitter absolute titles. */
export const BRAND = "AI Merge";

/** Legal publisher / operator of the site. */
export const PUBLISHER = "TetraNoodle Technologies";

/** The one contact address published across the site, llms.txt, and JSON-LD.
 *  A single address is one consistent entity signal instead of two competing
 *  ones. */
export const CONTACT_EMAIL = "feedback@tetranoodle.com";

// ---------------------------------------------------------------------------
// Route registry.
//
// Why this exists: `lastModified` otherwise lives only in app/sitemap.ts while
// the same dates get hand-typed into each page's visible "Last updated:" line,
// and the two drift. Sitemap generation, the on-page date, and the JSON-LD
// `dateModified` all read the same entry, so a page cannot claim one freshness
// date to Google and a different one to a human reader.
//
// `updated` is the real date the CONTENT last changed. Do not bump it for
// unrelated refactors: an uncorroborated lastmod is a false freshness signal
// that Google discounts and eventually ignores.
// ---------------------------------------------------------------------------

export type RouteKey =
  | "home"
  | "faq"
  | "glossary"
  | "privacy"
  | "terms"
  | "aiDataDisclosure"
  | "professionalDisclaimer"
  | "accessibility";

export type RouteEntry = {
  path: string;
  /** ISO date (YYYY-MM-DD) the content last materially changed. */
  updated: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Relative crawl priority within this site only. */
  priority: number;
};

export const ROUTES: Record<RouteKey, RouteEntry> = {
  home: { path: "/", updated: "2026-08-07", changeFrequency: "weekly", priority: 1 },
  // The two answer-engine pages carry the site's quotable Q&A and definition
  // corpus, so they rank above the legal set but below the doorway page.
  faq: { path: "/faq", updated: "2026-08-07", changeFrequency: "monthly", priority: 0.8 },
  glossary: {
    path: "/glossary",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  privacy: {
    path: "/privacy",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.4,
  },
  terms: {
    path: "/terms",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.4,
  },
  aiDataDisclosure: {
    path: "/ai-data-disclosure",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  // A parenting audience needs a professional-services disclaimer that names
  // the clinical/educational boundary explicitly (see the FAQ + footer).
  professionalDisclaimer: {
    path: "/professional-disclaimer",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  accessibility: {
    path: "/accessibility",
    updated: "2026-08-07",
    changeFrequency: "monthly",
    priority: 0.4,
  },
};

/** Absolute URL for a registry route. */
export const absoluteUrl = (path: string) =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/** Heading text → URL fragment. Shared by the glossary's visible anchors, the
 *  FAQ's question anchors, and the matching JSON-LD `@id`/`url` values, so a
 *  citation of the markup always lands on the passage a reader can see. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "2026-08-03" → "August 3, 2026", for the visible "Last updated" line.
 *  Parsed as UTC (the `Z`) so the rendered date cannot shift by a day
 *  depending on the build machine's timezone. */
export function formatUpdated(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
