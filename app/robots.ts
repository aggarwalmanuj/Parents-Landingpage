import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Canonical public origin comes from the shared lib/site.ts constant so
// robots, sitemap, metadata, and structured data can never diverge.
//
// AI crawlers are named explicitly even though `User-agent: *` already allows
// them. Three reasons:
//
// 1. Intent. Several of these agents are blocked by default by hosting
//    platforms, CDN bot-management rules, and boilerplate robots.txt files.
//    An explicit Allow states that this site WANTS to be readable by answer
//    engines, which is the whole objective for a page like this.
// 2. Precedence. robots.txt matching is by most-specific user-agent group, and
//    a crawler that finds its own group ignores the `*` group entirely. Naming
//    each agent guarantees it reads a rule written for it rather than
//    inheriting one, including the /admin and /api exclusions.
// 3. Coverage differs per engine. Google-Extended governs Gemini and AI
//    Overviews grounding but NOT Google Search indexing; Applebot-Extended
//    governs Apple Intelligence separately from Applebot. Allowing only the
//    search crawler would quietly leave the AI surfaces unserved.
//
// Removing an agent from this list opts the site out of that engine's answers.

const AI_AGENTS = [
  // OpenAI: training, the ChatGPT search index, and user-initiated fetches.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / AI Overviews grounding (separate from Googlebot).
  "Google-Extended",
  // Apple Intelligence (separate from Applebot).
  "Applebot-Extended",
  // Meta AI.
  "meta-externalagent",
  "FacebookBot",
  // Common Crawl: the corpus behind a large share of open model training and
  // retrieval sets, so it is disproportionately valuable per crawl.
  "CCBot",
  // Others.
  "Amazonbot",
  "cohere-ai",
  "DuckAssistBot",
  "MistralAI-User",
];

// Admin UI and API routes have no SEO value and should not be crawled.
const DISALLOW = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
