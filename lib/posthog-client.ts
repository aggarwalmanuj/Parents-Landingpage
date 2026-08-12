// The single owner of the posthog-js module reference.
//
// WHY THIS EXISTS
// posthog-js is ~233 KB of parsed JavaScript (~78 KB over the wire) and it is
// the largest single item in this page's initial bundle. It also cannot do
// anything until the visitor presses Accept on the cookie banner — so on a
// first visit from an ad, every byte of it is downloaded, parsed and then left
// idle while the hero is still trying to paint.
//
// A static `import posthog from "posthog-js"` anywhere in the client graph is
// what put it there: instrumentation-client.ts, lib/analytics.ts and
// lib/attribution.ts each had one, and any of them alone is enough to pull the
// whole library into the first load.
//
// So nothing imports posthog-js statically any more. instrumentation-client
// dynamic-imports it at the moment consent is granted and hands the instance
// here; everything else reads it through `getPostHog()`, which is null until
// then. That is the same state those callers already had to handle — before
// consent, `posthog.__loaded` was false and every helper no-oped — so the
// consent model and the event semantics are unchanged. Only the download moved.
//
// `import type` is erased at build time and pulls in no runtime code.
import type { PostHog } from "posthog-js";

let client: PostHog | null = null;

/** Fired once, when the client is installed. Consumers use it to release any
 *  events they buffered while posthog-js was still on the network — a timed
 *  retry is not enough on a slow connection, where the chunk can take longer
 *  to arrive than any sane give-up budget. */
const readyCallbacks: Array<(ph: PostHog) => void> = [];

/** The initialised client, or null if consent has not been granted yet, the
 *  chunk has not arrived yet, or PostHog is not configured at all. */
export function getPostHog(): PostHog | null {
  return client;
}

export function setPostHogClient(ph: PostHog): void {
  if (client) return;
  client = ph;
  // Drain to a local copy: a callback must not be able to observe a
  // half-emptied list, and none of them should run twice.
  const pending = readyCallbacks.splice(0, readyCallbacks.length);
  for (const cb of pending) {
    try {
      cb(ph);
    } catch {
      // Analytics must never break the page.
    }
  }
}

/** Run `cb` once the client exists — immediately if it already does. */
export function onPostHogReady(cb: (ph: PostHog) => void): void {
  if (client) {
    try {
      cb(client);
    } catch {
      // Analytics must never break the page.
    }
    return;
  }
  readyCallbacks.push(cb);
}
