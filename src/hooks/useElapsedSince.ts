import { useEffect, useState } from "react";

/** Default cadence for a "2 minutes ago" label — live enough, cheap enough. */
const DEFAULT_TICK_MS = 30_000;

/**
 * Milliseconds elapsed since `timestamp`, recomputed every `tickMs` so a
 * relative label stays honest without the caller polling. Returns `null` while
 * there is no timestamp yet.
 *
 * `Date.now()` is read inside the interval and parked in state — never in the
 * render body. A compiler that memoizes render-time expressions by their
 * dependencies (React Compiler, for one) has nothing to invalidate a bare
 * `Date.now()` on, so the label would freeze on its first value.
 *
 * A newer `timestamp` needs no re-anchoring: the stored `now` is then older
 * than it, the difference goes negative, and the clamp reports 0 — which is
 * exactly "just now" until the next tick lands.
 */
export function useElapsedSince(
  timestamp?: number,
  tickMs: number = DEFAULT_TICK_MS,
): number | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timestamp) return;
    const id = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(id);
  }, [timestamp, tickMs]);

  if (!timestamp) return null;
  return Math.max(0, now - timestamp);
}
