import { act, renderHook } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

type Listener = () => void;

const mockMatchMedia = (initial: boolean) => {
  const listeners = new Set<Listener>();
  const mq = {
    matches: initial,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((_: string, cb: Listener) => listeners.add(cb)),
    removeEventListener: vi.fn((_: string, cb: Listener) => listeners.delete(cb)),
  };
  const matchMedia = vi.fn(() => mq);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: matchMedia,
  });
  return {
    mq,
    matchMedia,
    set(next: boolean) {
      mq.matches = next;
      listeners.forEach((cb) => cb());
    },
    listenerCount: () => listeners.size,
  };
};

describe("useReducedMotion", () => {
  const original = window.matchMedia;
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: original,
    });
  });

  it("reads the current preference on first render", () => {
    const m = mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    expect(m.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("updates when the preference changes", () => {
    const m = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => m.set(true));
    expect(result.current).toBe(true);
    act(() => m.set(false));
    expect(result.current).toBe(false);
  });

  it("unsubscribes on unmount", () => {
    const m = mockMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    expect(m.listenerCount()).toBe(1);
    unmount();
    expect(m.listenerCount()).toBe(0);
  });

  it("returns false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
