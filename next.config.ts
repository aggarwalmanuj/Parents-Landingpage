import type { NextConfig } from "next";

/* ==========================================================================
   Security headers.

   Two groups:
   1. Always-enforced headers that cannot break third-party tools
      (nosniff, frame options, referrer policy, permissions policy, HSTS).
   2. The Content-Security-Policy, shipped as REPORT-ONLY first so we can
      confirm PostHog, the Meta Pixel, Calendly, and Vercel Analytics all
      load with zero violations in the browser console before enforcing.
      To enforce: set CSP_ENFORCE=true (or flip ENFORCE_CSP below) and the
      same policy is emitted as `Content-Security-Policy` instead.

      CSP_ENFORCE IS READ AT BUILD TIME, NOT AT RUNTIME. `next build`
      serialises whatever `headers()` returns into the build output
      (.next/routes-manifest.json), so the header NAME is fixed the moment the
      build runs. Setting the variable on a running server, or in a
      runtime-only environment, changes nothing and fails silently — it has to
      be set for the build, and flipping it means a rebuild/redeploy.

   Origins are derived from the actual code, not guessed:
   - PostHog: reverse-proxied through same-origin `/ingest/*` (see rewrites
     below), so `'self'` covers ingest. `*.posthog.com` / `*.i.posthog.com`
     are still allowed for session recording, toolbar, and static assets.
   - Meta Pixel: script from connect.facebook.net; beacons to *.facebook.com.
   - Calendly: assets.calendly.com (script/style), calendly.com (connect +
     the embedded booking iframe → frame-src).
   - Vercel Analytics (@vercel/analytics): same-origin /_vercel/insights/*
     plus va.vercel-scripts.com.
   - Fonts: next/font/google self-hosts, so no external font origin needed.

   Note on 'unsafe-inline' for scripts: the Meta Pixel bootstrap and the
   PostHog init are INLINE scripts injected at runtime. A strict nonce-only
   policy would require threading a per-request nonce through those inline
   <Script> tags via middleware; that is fragile with the third-party
   snippets in use. 'unsafe-inline' is the pragmatic, working choice here.
   If a stricter policy is wanted later, migrate to a nonce via middleware
   and drop 'unsafe-inline' from script-src.
========================================================================== */

const ENFORCE_CSP = process.env.CSP_ENFORCE === "true";

const csp = [
  "default-src 'self'",
  // Inline required by the Meta Pixel + PostHog bootstrap snippets.
  "script-src 'self' 'unsafe-inline' https://*.posthog.com https://*.i.posthog.com https://connect.facebook.net https://assets.calendly.com https://va.vercel-scripts.com",
  // Styled-jsx / Tailwind runtime + Calendly widget styles need inline styles.
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://*.posthog.com https://www.facebook.com https://*.facebook.com https://assets.calendly.com",
  "font-src 'self' data:",
  // XHR/fetch/beacon: PostHog proxy is same-origin ('self'); Meta + Calendly
  // + Vercel insights are cross-origin.
  "connect-src 'self' https://*.posthog.com https://*.i.posthog.com https://connect.facebook.net https://www.facebook.com https://*.facebook.com https://calendly.com https://*.calendly.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  // The embedded Calendly booking widget renders in an iframe.
  "frame-src 'self' https://calendly.com https://*.calendly.com",
  // PostHog session recording spawns a blob-URL web worker.
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Deny access to sensitive APIs this site never uses.
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Report-Only until verified clean, then enforcing via CSP_ENFORCE=true.
    key: ENFORCE_CSP
      ? "Content-Security-Policy"
      : "Content-Security-Policy-Report-Only",
    value: csp,
  },
];

const nextConfig: NextConfig = {
  // Dev-only: lets the ngrok tunnel load dev assets (ignored by next build/start).
  // Wildcard because free ngrok rotates the subdomain on every session.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  // PostHog endpoints require trailing slashes; Next's automatic redirect
  // breaks them. No app route depends on trailing-slash redirects.
  skipTrailingSlashRedirect: true,
  // Serve AVIF first (smallest), then WebP. Next 16 defaults to WebP-only;
  // adding AVIF gives the smaller payload where the browser supports it.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        /* Files under /public are served with `cache-control: public,
           max-age=0` by default, so every one of them is revalidated on every
           visit. For /_next/static that does not matter — those URLs are
           content-hashed and cached for a year automatically — but nothing in
           /public gets that treatment, and this page keeps its heaviest asset
           there: a 6.5 MB VSL that a returning visitor re-fetched in full.

           The filename carries the version (`vsl-parents-v1.mp4`), and the
           poster sits beside it in the same directory, so `immutable` is
           accurate: a new cut ships as v2 and gets a new URL. */
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        /* The rest of the static imagery. A day in the browser and a week of
           stale-while-revalidate at the edge, NOT `immutable`: these filenames
           are descriptive rather than versioned (`parents-00-entry.jpg`), so a
           replaced screenshot has to be able to reach people who already have
           the old one. Most of these are also requested through /_next/image,
           which caches the optimised output separately; this covers the
           originals and any direct reference. */
        source: "/:dir(images|take|logos|manuj|icon)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // More specific rule first.
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
