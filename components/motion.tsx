"use client";

// Motion primitives adapted from the scorecard-funnel landing.
//
// `Reveal` already lives in components/reveal.tsx (scroll-triggered section
// entrances). These two are the headline-level flourishes that give the
// funnel's landing its editorial feel, ported so the section grammar matches:
//
//   WordReveal    - headline composes itself word by word
//   MagneticButton - a CTA that leans toward the cursor
//
// Both degrade to plain content: WordReveal's spans render the same text with
// no JS, and MagneticButton is inert on touch devices and under
// prefers-reduced-motion (the CSS zeroes the transform).

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Segment =
  | { kind: "text"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "br" };

/**
 * Splits a headline into per-word spans and staggers each one's entrance.
 *
 * Takes structured segments rather than a raw string so callers can mark the
 * italic clause (the page's signature second line) without injecting HTML.
 * Whitespace is preserved inside each span so the text still selects, copies,
 * and reads to a screen reader as one continuous sentence.
 */
export function WordReveal({
  segments,
  baseDelay = 0,
  className = "",
}: {
  segments: Segment[];
  baseDelay?: number;
  className?: string;
}) {
  // Running index across ALL segments so the stagger continues across the
  // italic boundary instead of restarting mid-headline.
  let i = 0;
  return (
    <span className={className}>
      {segments.map((seg, segIdx) => {
        if (seg.kind === "br") {
          return <br key={`br-${segIdx}`} aria-hidden />;
        }
        const words = seg.text.split(/\s+/).filter(Boolean);
        return (
          <span
            key={`seg-${segIdx}`}
            className={seg.kind === "italic" ? "font-serif-italic" : ""}
          >
            {words.map((word, wIdx) => {
              const idx = i++;
              // Trailing space on every word except the very last of the very
              // last segment, so words don't run together when they wrap.
              const ws =
                wIdx < words.length - 1 || segIdx < segments.length - 1 ? " " : "";
              return (
                <span
                  key={`w-${segIdx}-${wIdx}`}
                  className="word-rise"
                  style={
                    {
                      ["--i" as string]: idx,
                      animationDelay: `calc(${idx} * 90ms + ${baseDelay}ms)`,
                    } as CSSProperties
                  }
                >
                  {word}
                  {ws}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Wraps a CTA so it translates slightly toward the pointer, capped at ±10px.
 *
 * Skipped entirely on devices without hover: on a phone the handler would
 * fire from the tap itself and shift the button under the finger.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    // The CSS honours prefers-reduced-motion by zeroing .magnetic's transform,
    // but skipping the listeners too avoids pointless work on every move.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.setProperty("--mx", String(Math.max(-10, Math.min(10, dx * strength))));
      el.style.setProperty("--my", String(Math.max(-10, Math.min(10, dy * strength))));
    };
    const handleLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`magnetic ${className}`}>
      {children}
    </div>
  );
}
