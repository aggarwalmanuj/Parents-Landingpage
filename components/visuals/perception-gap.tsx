/* ==========================================================================
   THE PERCEPTION GAP — a parent-report and a teen-report, side by side.

   The claim this section makes is narrow and it has to STAY narrow: a
   parent's read of the relationship and a teenager's experience of it can
   sit a long way apart. It is NOT "most parents are wrong", and it is not a
   statement about the visitor's own household.

   So the drawing does the one thing the prose cannot — it puts the two
   figures on the same scale, where the distance between them is the whole
   point — and the caption states plainly what the numbers are and what they
   are not.

   ENCODING, consistent with ClosenessDrift in the section above it:
   --signal is the parent's line, --muted-foreground is the child's. Colour is
   never the only encoding here either: every row carries a text label and its
   figure in type.

   THE SOURCE, verified 2026-08-14 — do not loosen any of this.

   Both figures are the "always" response to one question, in NCHS National
   Health Statistics Reports No. 206 (published 16 July 2024, data collected
   July 2021 – December 2022, ages 12-17 for both instruments). They are two
   estimates in ONE report, not two statistics stitched together.

   Teen (27.5%), NHIS-Teen, self-administered online:
     "How often do you get the social and emotional support you need?"
   Parent (76.9%), NHIS Sample Child, interviewer-administered:
     "How often does [name] get the social and emotional support [he/she]
      needs?" — i.e. a PROXY report about the named teen.

   THREE THINGS THE EARLIER DRAFT OF THIS FILE GOT WRONG, so they do not come
   back:
   1. It called both figures "self-reports". The parent figure is a proxy
      judgment about the teen. Only the teen figure is a self-report.
   2. It said the two groups were "asked separately", implying independent
      samples. NHIS-Teen is a follow-back nested INSIDE NHIS — every teen
      respondent has a parent who was interviewed about them, ~2-3 weeks
      earlier. The reason these are not matched households is different and
      more specific: NCHS computed the parent estimate over the FULL Sample
      Child sample (n=4,379) to keep it population-based, while the teen
      estimate covers only the teens who responded (n=1,157). Most of those
      parents describe a teen who never took the teen survey.
   3. It implied the source prints 49.4. It does not — the report states the
      two percentages; 49.4 is their difference, and the caption says so.

   The MODE EFFECT is disclosed on purpose and is not optional: NCHS itself
   warns that parents answering to an interviewer "may be more likely to
   overreport positive outcomes". Some of the distance is instrument, not
   perception. A page that trumpets a 49.4-point gap while hiding that would
   be doing exactly what the rest of it promises not to.

   Server component: tokens, type and two divs. No client JS, no image bytes.
========================================================================== */

import { Reveal } from "@/components/reveal";

const ROWS = [
  {
    who: "Parents",
    value: 76.9,
    color: "var(--signal)",
    // "say their teenager" — the wording has to keep signalling that this is a
    // parent answering ABOUT the teen, never a parent answering about
    // themselves. See the proxy note above.
    line: "said their teenager always gets the social and emotional support they need.",
  },
  {
    who: "Teenagers",
    value: 27.5,
    color: "var(--muted-foreground)",
    line: "said they always get the social and emotional support they need.",
  },
] as const;

/** 76.9 − 27.5. The report states both percentages but never prints their
 *  difference, so the caption attributes it as arithmetic rather than as a
 *  figure lifted from the source. */
const GAP_POINTS = "49.4";

const SOURCE = {
  label:
    "National Center for Health Statistics, National Health Statistics Reports No. 206: “Perceived Social and Emotional Support Among Teenagers: United States, July 2021–December 2022” (2024)",
  // The DOI, not a www.cdc.gov deep link: it is the publisher's permanent
  // identifier and survives the site reorganisations that break CDC PDF paths.
  href: "https://doi.org/10.15620/cdc/156514",
};

export function PerceptionGap() {
  return (
    <Reveal as="figure" className="w-full">
      <ul className="grid list-none gap-9">
        {ROWS.map(({ who, value, color, line }) => (
          <li key={who}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[12px] uppercase tracking-[0.16em] text-faint">
                {who}
              </p>
              <p className="font-serif text-3xl leading-none text-ink sm:text-4xl">
                {value}%
              </p>
            </div>
            {/* Decorative: the figure beside it and the sentence below it
                already carry the value, so the bar is aria-hidden rather than
                announced twice. */}
            <div
              aria-hidden
              className="mt-3 h-2.5 w-full overflow-hidden rounded-pill border border-line bg-bg"
            >
              <span
                className="block h-full rounded-pill"
                style={{ width: `${value}%`, background: color }}
              />
            </div>
            <p className="mt-3 text-[15px] leading-[1.7] text-muted">{line}</p>
          </li>
        ))}
      </ul>

      {/* States the arithmetic, not an interpretation. The prose beside this
          figure is where the page argues what the distance may mean, hedged;
          putting that argument in the biggest type on the section would be
          claiming more than two survey estimates can carry. */}
      <p className="mt-9 border-t border-line pt-6 text-center font-serif-italic text-xl leading-snug text-ink sm:text-2xl">
        {GAP_POINTS} points between what parents report
        <span className="block">and what teenagers report.</span>
      </p>

      <figcaption className="mt-7 space-y-3 text-sm leading-relaxed text-faint">
        <span className="block">
          Both figures are the &ldquo;always&rdquo; answer to one question about
          social and emotional support, for ages 12&ndash;17, over the same
          period. Source:{" "}
          <a
            href={SOURCE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted underline underline-offset-2 transition-colors hover:text-ink"
          >
            {SOURCE.label}
          </a>
          .
        </span>
        <span className="block">
          These are not matched households. The teen figure is what 1,157
          teenagers said about themselves; the parent figure is what 4,379
          parents said about their own teenager, most of whom did not take the
          teen survey. Parents also answered an interviewer while teenagers
          answered online, which NCHS notes can push parent answers higher - so
          the distance between the two is not all perception, and none of it
          describes any one family.
        </span>
      </figcaption>
    </Reveal>
  );
}
