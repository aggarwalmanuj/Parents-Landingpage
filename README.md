# Parenting Belief Score — landing page

The AI Merge **Parents** vertical doorway page. One offer, one CTA: the free
Parenting Belief Score.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
PostHog · Meta Pixel · Vercel Analytics. Same stack as the Coaches and
Consultants and B2B doorways, so all three deploy identically.

## Design provenance

- **Hero** — follows the Coaches and Consultants landing page: eyebrow →
  headline → VSL → CTA → trust line, in the Marine theme (deep navy ground, one
  teal `--signal` accent, Fraunces display + Inter).
- **Every section below the hero** — follows the `scorecard-funnel` landing's
  editorial grammar: a roman-numeral chapter mark, a Fraunces headline whose
  second clause drops to italic, an animated hairline rule, then the content.
  Those utilities live at the end of `app/globals.css`, expressed in Marine
  tokens so there is only ever one colour system on the page.

## Content register (these are compliance boundaries, not style)

- The score examines **the parent's own pattern, never the child's**. Nothing
  may assess, score, diagnose, or infer the state of a child.
- Educational and reflective — **not** diagnosis, treatment, or medical,
  psychological, legal, or family-therapy services.
- Belief is **never** the sole cause. Development, circumstances, personality,
  health, finances, history and culture stay explicitly real.
- AI is a supporting instrument, **not** the authority. The participant decides.
- No urgency, no scarcity, **no promised child outcome**.
- Completion time is **not published** until measured — the source document's
  literal `[VERIFIED TIME]` placeholder is preserved rather than invented.

## Launch blockers

Search for `TODO(launch)` and the bracketed placeholders. The critical ones:

1. `[INSERT APPROVED PRIVACY, STORAGE, HUMAN-REVIEW AND MODEL-TRAINING WORDING]`
   — in `lib/faq.ts`, `app/privacy`, `app/ai-data-disclosure`. **Rendered as
   visible text on purpose**: parents are describing private family moments, and
   an unanswered data question stops exactly the cautious visitor this page is
   built for.
2. `[VERIFIED TIME]` in the CTA microcopy — publish once measured.
3. Participant proof (Block 10) is deliberately **empty**. The document says
   "Do not invent." Collect three consented quotes post-launch. Never use a
   testimonial that promises child change.
4. `SITE_URL` in `lib/site.ts` and `SCORECARD_BASE_URL` in `lib/scorecard.ts` —
   confirm the approved production and assessment URLs.
5. Re-capture the walkthrough/result screenshots from the parenting question set
   so on-screen copy matches this page.

## Analytics

`lp=parents`, campaign `PARENT_BELIEF_SCORE_COLD_CA`. All events flow through
`lib/analytics.ts` into both PostHog and the Meta Pixel, and both sinks are
consent-gated (`lib/consent.ts`) — nothing loads before Accept.

- `landing_page_view`, `scroll_depth_25/50/75/90`
- Section views: `question_view`, `score_visual_view`, `recognition_view`,
  `whats_inside_view`, `founder_view`, `how_it_works_view`, `walkthrough_view`,
  `faq_view`, `final_cta_view`
- `vsl_play`, `vsl_25/50/75`, `vsl_complete`, `faq_open`, `walkthrough_step`
- `cta_click` with a `location` for all 11 CTA placements

First-touch UTM/click-id attribution (`lib/attribution.ts`) is captured
unconditionally and survives the conversion; a campaign-bearing record is final,
a direct/organic one is upgradeable. `buildScorecardUrl()` forwards UTMs,
`fbclid`/`gclid`/`ttclid`/`msclkid`, `_fbp`/`_fbc`, a stable visitor `ref`, and
`lp` to the assessment.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in pixel + PostHog values
npm run dev
```

Set `NEXT_PUBLIC_SCORECARD_BASE_URL` locally so dev CTA clicks don't create real
leads in the production funnel.
