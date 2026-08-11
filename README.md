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

## Rules established here (do not undo these)

**No section is text-only.** Every section carries a graphic matched to its
job. Where a moment could not be photographed without staging a child — which
the content register forbids — it is *drawn from its artifacts* instead
(`components/visuals/scenes.tsx`): a message thread, a plan gaining options, a
decision already made. If you add a section, it needs a visual before it ships.

**The pillar palette has two tokens per dimension, and they are not
interchangeable.**

| Token | Job | Contrast bar |
|---|---|---|
| `--pillar-N` | graphics only: ring strokes, bar fills, icon glyphs, borders, tints | 3:1 (graphical object) |
| `--pillar-N-ink` | only where a coloured *label* is genuinely the design | 4.5:1 (small text) |

`--pillar-N` are the funnel's `DIMENSION_COLORS` **verbatim**
(`#1a9cba / #d95926 / #9085e9 / #c98500`), because the real product captures on
this page render those exact hues — any drift and a visitor sees the same four
things in two different colours within one scroll. They previously held the
`-ink` values, because a series colour had been set on a 9px over-line, failed
contrast, and the palette was lifted to compensate. **The fix is never to move
the hue.** Put text in a text token, let the ring carry the colour, and reach
for `-ink` only for a genuinely coloured label (the closing recap chips are the
one such case, matching the assessment's own entry screen).

Colour is never the only encoding: every use ships with an icon *and* a text
label. The four hues identify the four scored dimensions and **nothing else** —
they are not available for decoration.

**Real page copy has a 12px floor.** Type below 12px is allowed only inside a
*simulated product screenshot*, where tiny chrome is the point (`.mac-window`,
`.device-frame`, the `sim-screens` frames). `.eyebrow`, `.text-eyebrow` and the
`.btn` clamp floor are all set to `0.75rem` for this reason.

**Decorative glows never get a negative x-inset.** `.hero-glow`, `.take-halo`
and `.signal-halo` are all vertical-only. A negative x-inset puts the element
past the viewport edge, and `overflow-x: clip` on `html`/`body` hides the
scrollbar but not the damage — so every "is it scrolling sideways?" check still
passes while content sits off-screen.

**`min-w-0` on grid tracks holding arbitrary content.** `truncate` implies
`white-space: nowrap`, and a nowrap element's min-content is its full string
width. A grid column is `minmax(auto, 1fr)`, whose `auto` minimum resolves to
the grid *item's* automatic minimum size — so `min-w-0` on the truncating
element is not enough; the track needs it too.

## Assets removed

- `public/take/question.jpg` and `public/take/beat.jpg` — real captures, but of
  the **business** vertical of the shared assessment. `question.jpg` asked about
  "a structural bottleneck", illustrated it with two people in business suits,
  and carried a Grammarly browser-extension icon inside the answer box;
  `beat.jpg` reflected back a sales moment and told the participant "the next
  step is not 'a call'". A real capture beats a rendered mock only when it is a
  capture of the right thing. Walkthrough steps 02 and 03 are drawn screens
  (`components/visuals/sim-screens.tsx`) until the parenting question set can be
  captured; each carries an "Illustrative" chip inside the frame.
- `components/pillar-dial.tsx` — superseded by `lib/pillars.ts` (plain module:
  constants exported from a `"use client"` file cross the boundary as
  client-reference proxies, not real values) plus
  `components/visuals/score-visuals.tsx`.

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
   so on-screen copy matches this page. Two of the five were from the wrong
   vertical and have been removed (see "Assets removed"); the remaining three
   (`audience.jpg`, `reportsummary.jpg`, `reportpdf.jpg`) are the shared
   assessment surface and are correct today, but still show the generic flow.
6. **Decision needed:** `reportsummary.jpg` is used as the proof for a *free*
   offer, and the capture visibly shows `SCORED — UNLOCKS WITH YOUR PLAN` with a
   padlock on each dimension. It is the real screen, so it has not been altered
   or hidden, but a paywall in the hero proof of a free score is a positioning
   call rather than an engineering one.

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
