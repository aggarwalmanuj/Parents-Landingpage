"use client";

// Sticky header that gains a border + blur once the page scrolls, signals
// position in the document without a hard layout jump.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScorecardCta } from "@/components/scorecard-cta";

// Doorway page: no nav menu. The doc's hero spec forbids navigation that
// consumes meaningful height or leaks visitors away from the single CTA.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        scrolled
          ? "border-line bg-bg/75 backdrop-blur-lg"
          : "border-line"
      }`}
    >
      {/* Two mobile fixes here, both measured at 320px:

          1. min-w-0 + gap-3. The logo (~114px), the CTA and the padding
             together exceeded the viewport, and because BOTH children were
             shrink-0 nothing could give. The logo keeps shrink-0 (it must not
             squash); the CTA wrapper is now allowed to shrink instead.

          2. overflow-x-clip. The CTA's decorative .cta-halo glow is a pseudo-
             element scaled 1.6x, so it spills ~43px past the button and was
             counting as scrollable width - the row's scrollWidth was 343
             against a 320 viewport, clipping the pill against the screen edge
             on every phone. Clipping HERE rather than on .cta-halo itself
             keeps the glow at full strength everywhere else on the page (the
             hero and in-body CTAs have room for it); only the header, which is
             the one place genuinely short of horizontal space, bounds it.
             `clip` not `hidden`: `hidden` would make this a scroll container
             and break `position: sticky` on the header. */}
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-6xl items-center justify-between gap-3 overflow-x-clip px-5 sm:gap-4 sm:px-8">
        {/* min-h-11: the anchor otherwise hugged the 16px-tall logo image,
            leaving a 114x16 tap target. The extra height is vertical padding
            inside the 64px header row, so nothing moves visually. */}
        {/* prefetch={false}: on the landing page this link points at the page
            the visitor is already looking at, and next/link still prefetches
            it — measured as three RSC requests totalling ~23 KB, fetched just
            after load on the same mobile connection the video preview is about
            to want. There is nothing to prefetch: navigating here is a no-op.
            On the sub-pages it is a genuine link, and one plain navigation
            back to the landing page is not worth prefetching six of them. */}
        <Link
          href="/"
          prefetch={false}
          className="flex min-h-11 shrink-0 items-center"
        >
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            priority
            // Without `sizes`, Next falls back to a 1x/2x srcset built from the
            // intrinsic 1274px width, so `priority` emits a preload for the
            // 1920w AND 3840w variants of a logo that renders ~114px wide. That
            // preload competes for bandwidth with the real LCP element (the
            // hero) at the worst possible moment. The logo is h-4 (16px) tall,
            // h-5 (20px) from `sm`, at a 1274/179 ratio: ~114px and ~142px wide.
            sizes="(min-width: 640px) 142px, 114px"
            className="brand-logo h-4 w-auto sm:h-5"
          />
        </Link>

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="cta-halo min-w-0">
            <ScorecardCta
              variant="signal"
              location="header"
              // Tighter horizontal padding on phones. Combined with min-w-0
              // above, this keeps the header row inside a 320px viewport
              // instead of clipping the pill against the right edge.
              className="min-w-0 !px-4 sm:!px-6"
            >
              {/* One label per breakpoint. Both strings ship in the DOM, so the
                  `hidden` one must not contribute width - `hidden` (not
                  `sm:inline` alone) is what guarantees that.

                  Both now say "Parenting". This is the ONE CTA visible at every
                  scroll depth, and it was the only CTA on the page omitting the
                  word - so the button a visitor sees most often was the button
                  doing least to tell them what page they are on. The phone
                  label is "My Parenting Score" rather than the full string
                  because the sticky row still has to survive a 320px viewport. */}
              <span className="hidden sm:inline">Free Parenting Belief Score</span>
              <span className="sm:hidden">My Parenting Score</span>
            </ScorecardCta>
          </span>
        </div>
      </div>
    </header>
  );
}
