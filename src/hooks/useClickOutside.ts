import { useRef, useEffect, type RefObject } from "react";

/**
 * Returns a ref; `handler` fires on any mousedown outside the referenced element.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent) => void,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handler]);

  return ref;
}
