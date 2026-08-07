// Per-page SEO metadata builder + the internal-link registry.
//
// Why this exists: Next merges metadata SHALLOWLY down the route tree. Any
// field a page does not set is inherited verbatim from app/layout.tsx. That
// makes every legal page inherit the root layout's `alternates.canonical: "/"`
// and its `openGraph.url: "/"`, so all sub-pages tell Google "the real version
// of me is the homepage" while sitemap.xml simultaneously submits them for
// indexing. Routing every page through this helper makes the canonical and
// og:url impossible to forget, and impossible to drift from each other.
//
// Pages pass a `RouteKey`, not a raw path, so the canonical URL, the sitemap
// entry, the visible "Last updated" line, and the JSON-LD `dateModified` all
// resolve from one registry entry in lib/site.ts.

import type { Metadata } from "next";
import type { RelatedLink } from "@/components/content-page";
import { BRAND, PUBLISHER, ROUTES, type RouteKey } from "@/lib/site";

// Setting `openGraph` on a page REPLACES the inherited object wholesale, and
// that includes the og:image the app/opengraph-image.tsx file convention
// contributes via the root layout. Without re-declaring it here, every legal
// page would share with no preview card at all. These values mirror the `size`
// and `alt` exports in app/opengraph-image.tsx; keep them in sync if that card
// changes. Width/height let crawlers reserve the slot without fetching first.
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "You know how to create value.",
  type: "image/png",
} as const;

// twitter-image.tsx re-exports the same card, so the dimensions match.
const TWITTER_IMAGE = { ...OG_IMAGE, url: "/twitter-image" } as const;

export function pageMetadata({
  title,
  description,
  route,
}: {
  /** Bare page title. The root layout's "%s · AI Merge" template appends the
   *  brand for <title>; og/twitter get the branded string explicitly. */
  title: string;
  description: string;
  /** Registry key from lib/site.ts. Supplies the canonical path. */
  route: RouteKey;
}): Metadata {
  const branded = `${title} · ${BRAND}`;
  const path = ROUTES[route].path;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      // `absolute` bypasses the parent title template, so the brand suffix is
      // applied exactly once no matter how the template later changes.
      title: { absolute: branded },
      description,
      url: path,
      type: "website",
      siteName: BRAND,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: branded },
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

// ---------------------------------------------------------------------------
// Internal-link registry.
//
// Without this, every sub-page is an orphan-adjacent dead end reachable only
// from the footer, and nothing on the site links to the FAQ or the glossary at
// all. Pages pull two or three siblings from here, so PageRank and crawlers
// flow between them and the two answer-engine pages are reachable from every
// route rather than from the footer alone.
// ---------------------------------------------------------------------------

export const LINKS: Record<RouteKey, RelatedLink> = {
  home: {
    href: ROUTES.home.path,
    label: "Parenting Belief Score",
    blurb: "The free score, how it works, and what your result contains.",
  },
  faq: {
    href: ROUTES.faq.path,
    label: "Frequently asked questions",
    blurb: "Direct answers on scope, accuracy, privacy, cost, and AI use.",
  },
  glossary: {
    href: ROUTES.glossary.path,
    label: "Glossary",
    blurb: "Possible belief, the loop, the moment to notice, defined.",
  },
  privacy: {
    href: ROUTES.privacy.path,
    label: "Privacy Policy",
    blurb: "What is collected, where it lives, and how to have it deleted.",
  },
  terms: {
    href: ROUTES.terms.path,
    label: "Terms of Use",
    blurb: "The terms governing use of this site and the free score.",
  },
  aiDataDisclosure: {
    href: ROUTES.aiDataDisclosure.path,
    label: "AI and Data Disclosure",
    blurb: "Where AI is used, what it never accesses, and its limits.",
  },
  professionalDisclaimer: {
    href: ROUTES.professionalDisclaimer.path,
    label: "Professional Services Disclaimer",
    blurb: "Educational scope: not therapy, medical, psychological, or legal advice.",
  },
  accessibility: {
    href: ROUTES.accessibility.path,
    label: "Accessibility",
    blurb: "Our WCAG 2.2 AA target, measures taken, and known limitations.",
  },
};

/** Pick related links by route key, in the order given. */
export const relatedLinks = (...keys: RouteKey[]) => keys.map((k) => LINKS[k]);

export { PUBLISHER };
