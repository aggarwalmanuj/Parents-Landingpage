"use client";

// Hero VSL. Playback model (mirrors the reference layout management sent):
// 1. Attempt muted autoplay behind a "click to unmute" overlay. The doc's
//    "no autoplay audio" rule is satisfied, sound only ever starts from a
//    user gesture.
// 2. First click unmutes, restarts from 0 (so no one joins mid-argument) and
//    hands over to native controls (keyboard + screen-reader accessible).
// 3. If autoplay is blocked or the visitor prefers reduced motion, we show
//    the poster with a plain play button instead.
// Captions are burned into the video file itself; swap to a <track> element
// when a .vtt file is supplied.

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * The Parenting Belief Score VSL and its poster.
 *
 * The poster is a frame taken at 2s rather than 0s: the first frame of most
 * cuts is a fade-from-black, which reads as a broken image in the hero well.
 *
 * Spec (Block 01): "Poster frame must be the live result interface, captions
 * on, no autoplay audio." The muted-autoplay + click-to-unmute model below
 * satisfies the audio rule; TODO(launch) replace the poster with an approved
 * frame of the live result interface once the final cut is delivered.
 *
 * If these are ever set back to null, the hero falls back to the placeholder
 * card further down rather than rendering a broken <video>.
 */
const VSL_SRC: string | null = "/video/vsl-parents-v1.mp4";
const VSL_POSTER: string | null = "/video/vsl-parents-poster.jpg";

const QUARTILES = [
  { at: 0.25, event: "vsl_25" },
  { at: 0.5, event: "vsl_50" },
  { at: 0.75, event: "vsl_75" },
] as const;

/** Floating annotation chips around the player (desktop only), as in the
 *  reference hero. Copy stays factual, no manufactured claims. */
const CHIPS = [
  {
    text: "Built from one real moment",
    className: "left-0 top-[12%] -translate-x-1/2",
  },
  {
    text: "Free · No card required",
    className: "right-0 top-[44%] translate-x-1/2",
  },
  // Zone A: the chips around the hero player carry the artifact spec, never a
  // caveat. "It examines your pattern, not your child's" is an argument the
  // page makes in Block 03, not a disclaimer bolted to the player.
  {
    text: "Built from your own words",
    className: "bottom-[12%] left-0 -translate-x-1/2",
  },
] as const;

type Mode = "preview" | "poster" | "playing";

export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Quartile flags live in a ref: timeupdate fires ~4×/s and must not re-render.
  const firedRef = useRef<Set<string>>(new Set());
  const [mode, setMode] = useState<Mode>("preview");

  useEffect(() => {
    // No approved cut yet: the placeholder card renders instead, and there is
    // no <video> to drive.
    if (!VSL_SRC) return;
    const video = videoRef.current;
    if (!video) return;
    // Reduced-motion visitors get the poster + a plain play button. No motion,
    // and no video bytes at all, until they ask for them.
    //
    // Scheduled on a microtask rather than called inline: React forbids a
    // synchronous setState in an effect body. This is the same timing the
    // previous implementation had, which reached setMode through a rejected
    // promise's .catch() — also a microtask. Deferring it to the idle callback
    // below instead would leave a reduced-motion visitor looking at the "Your
    // video is playing" overlay for up to 1.5s while nothing played.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setMode("poster"));
      return;
    }

    // Muted autoplay: allowed by policy almost everywhere, but Low-Power-Mode
    // iOS and some browsers still reject it, hence the catch.
    video.muted = true;

    // The autoplay attempt is deferred to the first idle callback rather than
    // fired during the effect. The VSL is a large progressive MP4, and calling
    // play() immediately starts streaming it in direct competition with the
    // hero poster and the display font for the same connection, during the
    // exact window LCP is measured in. Waiting for idle means the largest
    // paint lands on an uncontended network; the preview still starts a frame
    // or two later, well inside the time it takes to read the headline.
    //
    // The 1500ms timeout is the ceiling: on a busy main thread the callback
    // is forced to run rather than being starved indefinitely.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      video.play().catch(() => setMode("poster"));
    };

    const canIdle = typeof window.requestIdleCallback === "function";
    const handle = canIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (canIdle) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  const startWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    setMode("playing");
    trackEvent("vsl_play");
    video.play().catch(() => {
      // A gesture-initiated play should never be blocked; if it somehow is,
      // native controls are visible and the visitor can press play directly.
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    // Quartiles only count real (unmuted) viewing, not the silent preview.
    if (!video || mode !== "playing" || !video.duration) return;
    const progress = video.currentTime / video.duration;
    for (const q of QUARTILES) {
      if (progress >= q.at && !firedRef.current.has(q.event)) {
        firedRef.current.add(q.event);
        trackEvent(q.event);
      }
    }
  };

  const handleEnded = () => {
    if (mode !== "playing" || firedRef.current.has("vsl_complete")) return;
    firedRef.current.add("vsl_complete");
    trackEvent("vsl_complete");
  };

  return (
    <div className="vsl-stage relative">
      {/* Annotation chips float outside the frame on large screens only. */}
      {CHIPS.map((chip) => (
        <span
          key={chip.text}
          aria-hidden
          className={`vsl-chip absolute z-20 hidden lg:inline-flex ${chip.className}`}
        >
          {chip.text}
        </span>
      ))}

      <div className="hero-glow" aria-hidden />

      {/* No approved cut yet. Rather than play the wrong vertical's video, the
          frame holds an on-brand placeholder at the same 16:9 ratio, so the
          hero composition (and the CTA below it) is unchanged when the real
          cut lands. */}
      {!VSL_SRC ? (
        <div className="vsl-frame relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-surface px-6 text-center">
          <span
            aria-hidden
            className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-signal"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
            </svg>
          </span>
          <p className="text-title max-w-sm">
            The Parenting Belief Score walkthrough is being finalized.
          </p>
          <p className="max-w-md text-sm leading-relaxed text-faint">
            You do not need it to start. The free score works from one real
            parenting moment you describe in your own words.
          </p>
        </div>
      ) : (
      <div className="vsl-frame relative overflow-hidden rounded-2xl bg-surface">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          src={VSL_SRC}
          {...(VSL_POSTER ? { poster: VSL_POSTER } : {})}
          preload="metadata"
          playsInline
          muted
          controls={mode !== "preview"}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          aria-label="AI Merge Parenting Belief Score video"
        >
          {/* TODO(launch): add <track kind="captions" src="/video/vsl-captions.vtt" srcLang="en" label="English" />
              once the caption file is supplied. Captions are currently burned
              into the video itself. */}
          Your browser does not support the video tag.
        </video>

        {mode === "preview" && (
          <button
            type="button"
            onClick={startWithSound}
            className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            // No aria-label: the visible text ("Your video is playing. Click to
            // unmute.") is the accessible name, so it can never mismatch (WCAG
            // 2.5.3). The button restarts from 0 and unmutes on click.
          >
            <span className="flex flex-col items-center gap-2 rounded-2xl bg-bg/75 px-5 py-4 text-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.03] sm:gap-4 sm:px-12 sm:py-9">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-7 w-7 text-signal sm:h-11 sm:w-11"
              >
                <path
                  d="M11 5 6.5 9H3v6h3.5L11 19V5Z"
                  fill="currentColor"
                />
                <path
                  d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-title max-sm:text-base">
                Your video is playing.
                <br />
                Click to unmute.
              </span>
            </span>
          </button>
        )}

        {mode === "poster" && (
          <button
            type="button"
            onClick={startWithSound}
            className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            aria-label="Play the video"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-signal text-bg shadow-lg transition-transform duration-300 group-hover:scale-105">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      )}

      {/* Spec (AI AVATAR DISCLOSURE): displayed during the opening of the video
          AND beneath the player. This is the beneath-the-player half; the
          in-video disclosure belongs to the approved VSL cut itself.

          Gated on VSL_SRC: with no video playing, claiming "this video uses an
          AI-generated avatar" would describe something that isn't on the page. */}
      {VSL_SRC && (
        <p className="mt-3 text-center text-xs leading-relaxed text-faint">
          This video uses an AI-generated avatar and voice of Manuj Aggarwal.
        </p>
      )}
    </div>
  );
}
