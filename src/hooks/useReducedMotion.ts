import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const canMatch = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * Tracks the user's `prefers-reduced-motion` setting and re-renders when it
 * changes. For motion CSS can't reach (JS-driven chart or scroll animations);
 * plain CSS should use the `motion-reduce:` variant instead.
 *
 * SSR-safe: returns `false` when there is no `window` / `matchMedia`.
 */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(
    () => canMatch() && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    if (!canMatch()) return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    // Sync once in case it changed between the initial render and the effect.
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    // Safari < 14 only has the deprecated listener API.
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
};

export default useReducedMotion;
