"use client";

// Scroll-triggered entrance. Motion intent: orchestrate section entrances so
// content arrives in reading order instead of all at once. Falls back to
// fully-visible content when IntersectionObserver is unavailable and under
// prefers-reduced-motion (handled in CSS).

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger offset in ms, for sibling reveals (30-60ms steps). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "ul" | "ol" | "figure" | "aside" | "dl";
  /**
   * Skip the scroll-triggered entrance and show the content straight away.
   * Use for media that must be visible the moment the page loads (e.g. the
   * hero VSL and the testimonial video reel) so a video never sits hidden
   * behind an un-triggered fade.
   */
  immediate?: boolean;
  /**
   * Play the entrance from CSS alone, with no JavaScript involved at all.
   *
   * For anything above the fold, `.reveal`'s `opacity: 0` is a trap: the
   * content is invisible until this component mounts, an IntersectionObserver
   * is constructed and `is-visible` is added — i.e. until the whole client
   * bundle has downloaded, parsed and hydrated. On a cold mobile connection
   * that is seconds, and it is spent staring at a blank hero. It also
   * disqualifies the headline from being Largest Contentful Paint at first
   * paint, because an element at `opacity: 0` has not painted, so LCP is
   * pushed out to whenever hydration happens to land.
   *
   * `priority` swaps the JS-gated transition for an equivalent CSS keyframe
   * that starts as soon as the element is parsed. Same motion, same delay,
   * same resting state — but the browser can paint the hero without waiting
   * for React, and it counts for LCP the moment it starts fading in.
   *
   * Use it for everything in the first viewport, and nowhere else: it runs on
   * parse, so an element far down the page would finish its entrance long
   * before the visitor ever scrolled to it.
   */
  priority?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  immediate = false,
  priority = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Immediate content is already visible via the `is-visible` class below,
    // and priority content is animated entirely by CSS; neither has anything
    // for an observer to do.
    if (immediate || priority) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    // Reveal as soon as ANY part of the element enters the adjusted viewport.
    //
    // This used to require `threshold: 0.1`, which silently stranded content
    // at opacity 0: an element taller than the viewport (or one whose first
    // 10% sits below the -8% bottom margin) can be well into view without ever
    // crossing a 10%-of-its-own-height ratio, so the observer never fired and
    // the section — including its CTA — stayed invisible. Threshold 0 asks the
    // only question that actually matters here: has it started to enter?
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    observer.observe(el);

    // Safety net: if the element is already within the viewport at mount (an
    // anchor jump, a restored scroll position, or a parent that only just laid
    // out), reveal it now rather than waiting for a scroll event that a user
    // who is already at the bottom of the page will never produce.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, [immediate, priority]);

  const Tag = as;
  // `reveal-now` deliberately does NOT carry `reveal`: the point is to avoid
  // that class's `opacity: 0` resting state, which is what makes the content
  // depend on JavaScript.
  const revealClass = priority
    ? "reveal-now"
    : `reveal ${immediate ? "is-visible" : ""}`;
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      // `is-visible` from first paint when immediate: no opacity:0 flash, and
      // the content is present even before hydration / if JS never runs.
      className={`${revealClass} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
