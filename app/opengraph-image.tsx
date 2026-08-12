import { ImageResponse } from "next/og";

// Copy is declared once so the same strings drive the render, the font
// glyph-subsetting, and the `alt` text below. Matches the live hero headline.
const EYEBROW = "Free Parenting Belief Score";
// Mirrors the live H1. Line 2 is the shortened form of "Why does it feel like
// they're growing away?" — at 78px the full question runs to roughly 1600px
// inside a 1040px text column, so the card carries the same turn in fewer
// words rather than shrinking the type until the card stops reading at
// thumbnail size in a feed.
const HEAD_LINE_1 = "Your kids are growing up.";
const HEAD_LINE_2 = "Are they growing away?";
const SUBHEAD =
  "A free, personalised Parenting Belief Score, built from your own words. Five questions, about 10 minutes, no credit card.";
const FOOTER = "AI Merge · TetraNoodle Technologies";

// Route segment config. Node runtime so it can be generated at build time.
export const runtime = "nodejs";
// Derived from the card's own headline so the alt text can never drift from what
// the image shows. twitter-image.tsx re-exports this same value.
export const alt = `${HEAD_LINE_1} ${HEAD_LINE_2}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Load a single Google Font instance as raw font data for satori. The page's
 * type system is Fraunces (serif headlines) + Inter (body), the same families
 * wired via next/font in app/layout.tsx, so the card matches the live page
 * instead of introducing a new typeface. `text` subsets to only the glyphs used,
 * keeping each fetch tiny. Returns null on any failure so the build never breaks
 * on a network hiccup (satori then falls back to its default sans).
 */
async function loadFont(
  family: string,
  weight: number,
  text: string,
  italic = false
): Promise<ArrayBuffer | null> {
  try {
    const axis = `ital,wght@${italic ? 1 : 0},${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(
      / /g,
      "+"
    )}:${axis}&text=${encodeURIComponent(text)}`;
    // A non-woff2 UA makes the CSS2 endpoint return a TTF URL, which satori reads.
    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const src = css.match(/src: url\((.+?)\) format\('(truetype|opentype)'\)/);
    if (!src) return null;
    return await fetch(src[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Branded 1200x630 share card, generated in code so it doesn't depend on
 * cropping the portrait hero photo. Colours mirror the "marine" palette locked
 * in app/globals.css (background #0a232e, ink #eff5f8, foreground #b6cdd8,
 * accent teal #5ec8d6); type mirrors the page's Fraunces + Inter system. Next
 * auto-injects og:image / twitter:image (with correct absolute URLs via
 * metadataBase) from this file.
 */
export default async function OpengraphImage() {
  const [fraunces, frauncesItalic, interRegular, interMedium] =
    await Promise.all([
      loadFont("Fraunces", 600, HEAD_LINE_1),
      loadFont("Fraunces", 600, HEAD_LINE_2, true),
      loadFont("Inter", 400, SUBHEAD),
      loadFont("Inter", 500, EYEBROW + FOOTER),
    ]);

  // Only register fonts that actually loaded; if none did, satori uses its
  // built-in fallback and the card still renders.
  const fonts = [
    fraunces && { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
    frauncesItalic && {
      name: "Fraunces",
      data: frauncesItalic,
      weight: 600,
      style: "italic",
    },
    interRegular && { name: "Inter", data: interRegular, weight: 400, style: "normal" },
    interMedium && { name: "Inter", data: interMedium, weight: 500, style: "normal" },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500 | 600;
    style: "normal" | "italic";
  }[];

  const serif = fonts.some((f) => f.name === "Fraunces") ? "Fraunces" : "serif";
  const sans = fonts.some((f) => f.name === "Inter") ? "Inter" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0a232e 0%, #0d2b38 55%, #123748 100%)",
          padding: "72px 80px",
          fontFamily: sans,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5ec8d6",
            fontWeight: 500,
          }}
        >
          {EYEBROW}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Explicit stacked lines (not <br/>), satori collapses <br/> inside a
              flex row. Mirrors the live H1: a statement then an italic line, in
              Fraunces like the page headline. */}
          <div
            style={{
              display: "flex",
              fontFamily: serif,
              fontSize: 78,
              lineHeight: 1.08,
              color: "#eff5f8",
              fontWeight: 600,
              letterSpacing: -1,
            }}
          >
            {HEAD_LINE_1}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: serif,
              fontSize: 78,
              lineHeight: 1.08,
              color: "#b6cdd8",
              fontWeight: 600,
              fontStyle: "italic",
              letterSpacing: -1,
            }}
          >
            {HEAD_LINE_2}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#b6cdd8",
              maxWidth: 960,
            }}
          >
            {SUBHEAD}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            color: "#7fa3b3",
            fontWeight: 500,
          }}
        >
          {FOOTER}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
