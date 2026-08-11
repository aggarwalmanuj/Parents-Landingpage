import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/cookie-consent";
import { FacebookPixel } from "@/components/facebook-pixel";
import { StructuredData } from "@/components/structured-data";
import { BRAND, PUBLISHER, SITE_URL } from "@/lib/site";
import "./globals.css";

// Inter: all UI, body, buttons, eyebrows, labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fraunces: editorial display headlines (400) + italic emphasis (300 italic).
// Loaded as a variable font with the optical-sizing axis.
//
// `SOFT` is deliberately NOT in this axes list: no rule in globals.css or any
// component declares `font-variation-settings`, so every byte of that axis
// would be downloaded and never rendered. `opsz` stays because .text-display
// and .text-headline both set `font-optical-sizing: auto`. Each extra axis
// enlarges the variable font file, and a display font sits on the critical
// path for the hero headline, so this is straight LCP savings for no visual
// change. Re-add an axis here only alongside the rule that uses it.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale/userScalable=no: blocking pinch-zoom is an
  // accessibility failure and hurts the Lighthouse a11y score.
  themeColor: "#0a232e",
};

export const metadata: Metadata = {
  // Canonical origin for the deployed site. Canonical/OG/Twitter URLs below
  // resolve against this, so it must match the domain we want indexed.
  // Sourced from lib/site.ts (single source of truth).
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Parenting Belief Score · AI Merge",
    template: "%s · AI Merge",
  },
  // Held near ~160 characters so Google can use it verbatim instead of
  // rewriting a truncated one. A description that runs to 220 gets cut
  // mid-sentence, which is exactly when Google substitutes its own snippet.
  // Leads with the offer and the objection that decides the click.
  description:
    "Free, personalised Parenting Belief Score: see what may be shaping your response before the next conversation. Built from your own words. No credit card.",
  applicationName: BRAND,
  // Authorship and publisher are the machine-readable half of E-E-A-T. The
  // JSON-LD Person/Organization graph asserts the same two entities, so the
  // meta tags and the structured data corroborate rather than merely coexist.
  authors: [{ name: "Manuj Aggarwal", url: "https://manujaggarwal.com" }],
  creator: "Manuj Aggarwal",
  publisher: PUBLISHER,
  category: "Parenting",
  alternates: {
    // NOTE: inherited by every child route that does not set its own.
    // Sub-pages must go through `pageMetadata()` (lib/seo.ts) so they override
    // this with their own path, otherwise they self-canonicalise to "/".
    canonical: "/",
  },
  // Indexing is already the default, but stating the preview limits explicitly
  // is what unlocks the richer SERP treatment: `max-image-preview:large` lets
  // Google show the full-size OG card next to the result instead of a thumbnail
  // or nothing, and `max-snippet:-1` removes the snippet length cap. Both raise
  // click-through rate without changing what is indexed.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Free Parenting Belief Score · AI Merge",
    description:
      "See what may be shaping your response before the next conversation, built from your own words. Free and personalised. It examines your pattern, not your child's - a reflective tool, not a diagnosis.",
    type: "website",
    url: "/",
    siteName: "AI Merge",
    // og:image is auto-injected from app/opengraph-image.tsx (generated card).
    // No static `images` here so the generated card is not overridden.
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Parenting Belief Score · AI Merge",
    description:
      "See what may be shaping your response before the next conversation. Free, personalised, built from your own words. Reflective, not diagnostic.",
    // twitter:image is auto-injected from app/twitter-image.tsx.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Marine is THE brand theme (deep navy + one teal accent). The 12-palette
      // switcher is retired; tokens live in globals.css.
      data-palette="marine"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly,
          etc.) inject attributes like cz-shortcut-listen onto <body> before
          React hydrates, which would otherwise log a hydration mismatch. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <StructuredData />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* Consent-gated: the pixel script is injected only after Accept.
            The old <noscript> pixel fallback is gone on purpose: it cannot
            be consent-gated, which GDPR requires. */}
        <FacebookPixel />
        <CookieConsent />
        {/* Vercel Analytics is cookieless, so it runs without consent. */}
        <Analytics />
      </body>
    </html>
  );
}
