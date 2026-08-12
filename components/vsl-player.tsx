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

/**
 * Whether it is reasonable to spend this visitor's bandwidth on a silent
 * preview they did not ask for.
 *
 * The VSL is a 6.5 MB progressive MP4 with no adaptive variants, so a muted
 * autoplay is not a cheap flourish: the browser opens a `bytes=0-` range
 * request and pulls the entire file. On the mid-range Android phone on a
 * mobile connection that this page's paid traffic actually arrives on, that is
 * the largest single thing the page does, and the visitor may well leave
 * before the video they never started is finished downloading.
 *
 * Where the browser tells us the connection is metered or slow, the preview is
 * skipped and the poster + play button is shown instead — the video then costs
 * nothing at all unless it is asked for. Everywhere else the preview is
 * unchanged. The Network Information API is Chromium-only, so this is a
 * best-effort improvement for the visitors it can identify, never a gate.
 */
function connectionCanAffordPreview(): boolean {
  try {
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (!conn) return true;
    if (conn.saveData) return false;
    return conn.effectiveType !== "slow-2g" && conn.effectiveType !== "2g";
  } catch {
    return true;
  }
}

export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Quartile flags live in a ref: timeupdate fires ~4×/s and must not re-render.
  const firedRef = useRef<Set<string>>(new Set());
  // Starts on the poster, not on the preview overlay.
  //
  // The overlay reads "Your video is playing. Click to unmute.", and with the
  // autoplay attempt now deferred past load that sentence would be false for
  // the first few seconds of every visit — and permanently false for anyone
  // whose browser refuses the autoplay or whose connection is metered. The
  // player promotes itself to "preview" when play() actually succeeds, so the
  // overlay now only ever appears over a video that is genuinely running.
  const [mode, setMode] = useState<Mode>("poster");

  useEffect(() => {
    // No approved cut yet: the placeholder card renders instead, and there is
    // no <video> to drive.
    if (!VSL_SRC) return;
    const video = videoRef.current;
    if (!video) return;
    // Reduced-motion visitors get the poster + a plain play button. No motion,
    // and no video bytes at all, until they ask for them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!connectionCanAffordPreview()) return;

    // Muted autoplay: allowed by policy almost everywhere, but Low-Power-Mode
    // iOS and some browsers still reject it, hence the catch.
    video.muted = true;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      // preload="none" means the element holds no bytes yet; play() is what
      // starts the fetch, which is exactly the point — nothing is downloaded
      // until this moment.
      video.play().then(
        () => {
          if (!cancelled) setMode("preview");
        },
        () => {
          // Autoplay refused. The poster and its play button are already what
          // is on screen, so there is nothing to change.
        }
      );
    };

    // The autoplay attempt waits for the `load` event, then for idle.
    //
    // It used to wait for idle alone, with a 1500ms ceiling. That was not
    // enough: on a throttled mobile connection the page is still fetching the
    // font, the stylesheet and the JavaScript that the hero needs at 1500ms,
    // so the ceiling fired mid-flight and the video began streaming straight
    // into the middle of the LCP window, competing with the assets that decide
    // when the headline and CTA appear.
    //
    // Anchoring to `load` means the preview cannot start until everything the
    // page needs in order to be usable has already arrived. The idle callback
    // after it yields the main thread one more time so play() does not land
    // inside hydration. Both are bounded, so a page that never fires `load`
    // (a stalled below-the-fold image, say) still gets its preview.
    let idleHandle: number | undefined;
    // `load` and the backstop timer can both fire; only the first may schedule.
    let scheduled = false;
    const afterLoad = () => {
      if (cancelled || scheduled) return;
      scheduled = true;
      idleHandle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(start, { timeout: 2000 })
          : window.setTimeout(start, 200);
    };

    let loadTimer: number | undefined;
    if (document.readyState === "complete") {
      afterLoad();
    } else {
      window.addEventListener("load", afterLoad, { once: true });
      // Backstop for a `load` that never comes.
      loadTimer = window.setTimeout(afterLoad, 8000);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", afterLoad);
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
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
      {/* Annotation chips float outside the frame on large screens only.

          `xl`, not `lg`. These sit at `left-0 -translate-x-1/2`, i.e. half
          their own width outside the player. The player lives in a
          `max-w-4xl` (896px) column, so at exactly 1024px the page margin is
          only 64px and a ~212px chip hung 10px past the viewport edge — real
          content off-screen, hidden by the page's `overflow-x: clip`. At
          1280px the margin is 192px and the chip clears comfortably. */}
      {CHIPS.map((chip) => (
        <span
          key={chip.text}
          aria-hidden
          className={`vsl-chip absolute z-20 hidden xl:inline-flex ${chip.className}`}
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
          // "none", not "metadata". `metadata` sounds cheap and is not: for a
          // progressive MP4 whose moov atom placement we do not control,
          // Chrome opens a `bytes=0-` range request and streams the whole
          // 6.5 MB file — measured, not assumed. That download started during
          // the initial page load, on the same connection as the font and the
          // JavaScript, for a video most visitors never unmute.
          //
          // Nothing is lost: the poster still renders (it is a separate image),
          // the effect above calls play() once the page has loaded, and a
          // visitor who presses play gets the fetch started by that gesture.
          preload="none"
          playsInline
          muted
          // `mode === "playing"`, not `mode !== "preview"`. "poster" is now the
          // state the player STARTS in rather than only the state it falls back
          // to, and showing a native control bar across the hero poster from
          // first paint would change how the hero looks. The overlay's play
          // button is the affordance until then (it carries an accessible
          // name, so keyboard and screen-reader users reach it), and pressing
          // it moves the player to "playing", which hands over to the native
          // controls exactly as before.
          controls={mode === "playing"}
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
