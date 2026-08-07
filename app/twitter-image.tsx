// Reuse the same generated card, and the same alt/size/contentType, for the
// Twitter/X summary_large_image preview, so nothing is duplicated. Only `runtime`
// is declared directly: Next must detect it statically and can't see it through
// a re-export.
export const runtime = "nodejs";
export { alt, size, contentType, default } from "./opengraph-image";
