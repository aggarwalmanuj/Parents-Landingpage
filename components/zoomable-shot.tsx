"use client";

// Tap/click-to-enlarge product screenshot.
//
// Why this exists: the result screenshots are the page's central proof, and the
// document is explicit that they must show the live product exactly as it
// renders. But the source captures are ~1800px of dense UI, and inside a
// 5-column desktop slot — or a 390px phone — the type inside them is well below
// legibility. A proof the visitor cannot read is decoration.
//
// So the inline image stays as the composition intends, and this adds an
// explicit affordance to see it full-size. Implemented with <dialog> rather
// than a hand-rolled overlay so focus trapping, Escape-to-close, inert
// background, and the top layer come from the platform instead of from
// JavaScript that has to re-implement all four correctly.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Expand, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ZoomableShot({
  src,
  alt,
  width,
  height,
  caption,
  sizes,
  priority = false,
  /** Identifies which shot was opened, for the funnel report. */
  event,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sizes?: string;
  priority?: boolean;
  event: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const show = () => {
    // showModal() is what puts the dialog in the top layer and makes the rest
    // of the page inert. Guarded because it throws if already open.
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    setOpen(true);
    trackEvent("screenshot_zoom", { shot: event });
  };

  // Keep React state in sync with native closes (Escape, backdrop, form
  // method=dialog) so the component never believes it is open when it is not.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <figure className={className}>
        {/* The trigger is a real button wrapping the image, so it is reachable
            by keyboard and announced as an action rather than as a decorative
            image that happens to respond to clicks. */}
        <button
          type="button"
          onClick={show}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)] transition-colors duration-300 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          aria-label={`Enlarge: ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full"
          />
          {/* Affordance chip. Always visible on touch (where there is no hover
              to reveal it), and fading in on pointer devices. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-pill bg-bg/85 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100"
          >
            <Expand className="h-3 w-3" strokeWidth={2} />
            Tap to enlarge
          </span>
        </button>
        {caption && (
          <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-faint">
            {caption}
          </figcaption>
        )}
      </figure>

      <dialog
        ref={dialogRef}
        // Backdrop click closes: the dialog element itself fills the viewport,
        // so a click landing on IT (rather than on the inner figure) is a
        // backdrop click.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="shot-dialog"
        aria-label={alt}
      >
        <div className="relative flex max-h-[92vh] max-w-[94vw] flex-col gap-3">
          <button
            type="button"
            onClick={close}
            className="self-end inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-line-strong"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Close
          </button>
          {open && (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              // Full-bleed inside the dialog; the image is the point here, so
              // it gets the whole viewport rather than a layout slot.
              sizes="94vw"
              className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
