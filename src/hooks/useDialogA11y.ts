import { useEffect, useRef } from "react";

/**
 * Ids of every currently-mounted dialog, oldest first. The last entry is the
 * top-most dialog and is the ONLY one that reacts to Escape — without this a
 * nested dialog (a `ConfirmDialog` opened from inside a `Modal`) and its parent
 * would both close on a single keypress.
 *
 * Module-level on purpose: the stack has to be shared across sibling React
 * subtrees that each portal into `document.body`, so context is not an option.
 */
const dialogStack: string[] = [];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * `offsetParent` is null for `position: fixed` nodes, so it can't be used as a
 * visibility probe here — dialog bodies legitimately contain fixed-positioned
 * dropdowns (a `MultiSelect` list).
 */
const isReachable = (element: HTMLElement): boolean =>
  element.getClientRects().length > 0 && !element.closest("[inert]");

export interface UseDialogA11yOptions {
  /** Stable per-instance id, from the caller's `useId()`. */
  id: string;
  /** Ref to the element carrying `role="dialog"` and `tabIndex={-1}`. */
  dialogRef: React.RefObject<HTMLElement | null>;
  /** Called when Escape is pressed on the top-most dialog. Omit to disable. */
  onEscape?: () => void;
}

/**
 * Dialog behaviour shared by `Modal` (and any custom dialog a consumer builds):
 * Escape-to-close scoped to the top-most dialog, focus capture on open with
 * restore on close, and a Tab cycle trap.
 *
 * The Tab trap is returned as a handler you bind to the dialog element rather
 * than being installed on `document`. That is deliberate: when focus has
 * legitimately left the dialog subtree — into a row menu or a dropdown
 * portalled to `document.body` — the handler simply never fires and the
 * browser's native tab order takes over, instead of the dialog yanking focus
 * back and breaking those menus.
 */
export function useDialogA11y({ id, dialogRef, onEscape }: UseDialogA11yOptions) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  // Register/unregister in the dialog stack for the lifetime of the dialog.
  useEffect(() => {
    dialogStack.push(id);
    return () => {
      const index = dialogStack.lastIndexOf(id);
      if (index !== -1) dialogStack.splice(index, 1);
    };
  }, [id]);

  // Escape closes the top-most dialog only, and never when an inner control
  // already consumed the key (a combobox calls preventDefault while its list
  // is open, so Escape closes the list before the dialog).
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (dialogStack[dialogStack.length - 1] !== id) return;
      const close = onEscapeRef.current;
      if (!close) return;
      event.preventDefault();
      close();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [id]);

  // Move focus into the dialog on open and hand it back on close.
  useEffect(() => {
    const node = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // A child may have claimed focus already (an `autoFocus` input). Don't
    // steal it — only focus the shell when nothing inside is focused.
    if (node && !node.contains(document.activeElement)) {
      node.focus({ preventScroll: true });
    }

    return () => {
      // Deferred by a frame so the checks below run after React has detached
      // the dialog's DOM. Two things depend on that: (1) when a dialog and its
      // nested dialog close together, the nested dialog's restore target is
      // already gone and is correctly skipped; (2) under StrictMode's
      // mount/unmount/mount the re-mounted dialog has already taken focus by
      // the time this runs, so the restore is skipped instead of fighting it.
      requestAnimationFrame(() => {
        if (!previouslyFocused?.isConnected) return;
        const active = document.activeElement;
        const focusIsUnclaimed =
          !active ||
          active === document.body ||
          active === document.documentElement;
        if (!focusIsUnclaimed) return;
        previouslyFocused.focus?.({ preventScroll: true });
      });
    };
  }, [dialogRef]);

  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || event.defaultPrevented) return;
    const node = dialogRef.current;
    if (!node) return;

    const focusables = Array.from(
      node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(isReachable);

    if (focusables.length === 0) {
      event.preventDefault();
      node.focus({ preventScroll: true });
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || active === node)) {
      event.preventDefault();
      last.focus();
    }
  };

  return { onDialogKeyDown };
}

export default useDialogA11y;
