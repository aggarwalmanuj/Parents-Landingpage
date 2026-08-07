import type { MetadataRoute } from "next";
import { ROUTES, absoluteUrl } from "@/lib/site";

// `lastModified` must NOT be `new Date()`: that makes every route claim to have
// changed at build time, so redeploying an unrelated component republishes all
// URLs as "just updated". That is a false freshness signal — Google discounts
// (and eventually ignores) a lastmod it cannot corroborate against the actual
// page content, costing the site the crawl-scheduling benefit lastmod exists to
// provide.
//
// The dates come from the ROUTES registry in lib/site.ts, which is the same
// entry that renders each page's visible "Last updated:" line and its JSON-LD
// `dateModified`. Update the date there when you update the copy, and all three
// move together. Deriving the URL list from the registry also means a new route
// cannot be added without appearing in the sitemap.

export default function sitemap(): MetadataRoute.Sitemap {
  // Public marketing routes only, /admin and /api are intentionally excluded.
  return Object.values(ROUTES).map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.updated,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
