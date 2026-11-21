import { useEffect, useRef } from "react";

export interface UseGlobalHotkeyOptions {
  /** Key to match, case-insensitive (e.g. "k"). */
  key: string;
  /** Match when the Cmd/meta key is held (macOS). OR-combined with `ctrl`. */
  meta?: boolean;
  /** Match when the Ctrl key is held (Windows/Linux). OR-combined with `meta`. */
  ctrl?: boolean;
  /** Invoked when the combo fires. Receives the original event. */
  onTrigger: (event: KeyboardEvent) => void;
  /** When false the listener is detached. Defaults to true. */
  enabled?: boolean;
}

/**
 * Registers a single global `keydown` hotkey on `document` — e.g. ⌘K / Ctrl+K
 * to open a `<CommandPalette/>`:
 *
 * ```ts
 * useGlobalHotkey({ key: "k", meta: true, ctrl: true, onTrigger: () => setOpen(true) });
 * ```
 *
 * When the combo matches it calls `event.preventDefault()`, so the browser's
 * own binding (Firefox's Cmd/Ctrl+K search bar) does not also fire. With
 * neither `meta` nor `ctrl` set, the bare key matches. The handler is read from
 * a ref, so passing a fresh `onTrigger` each render does not re-subscribe.
 */
export function useGlobalHotkey({
  key,
  meta = false,
  ctrl = false,
  onTrigger,
  enabled = true,
}: UseGlobalHotkeyOptions): void {
  const handlerRef = useRef(onTrigger);

  useEffect(() => {
    handlerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: KeyboardEvent) => {
      const modifierOk =
        (meta && event.metaKey) || (ctrl && event.ctrlKey) || (!meta && !ctrl);
      if (!modifierOk) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      event.preventDefault();
      handlerRef.current(event);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [key, meta, ctrl, enabled]);
}

export default useGlobalHotkey;
