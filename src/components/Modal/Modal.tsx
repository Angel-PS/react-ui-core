import React, { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useModal } from "./useModal";
import { ModalHeader } from "./ModalHeader";
import { ModalBackdrop } from "./ModalBackdrop";
import { useDialogA11y } from "../../hooks/useDialogA11y";
import { cn } from "../../lib/utils";
import type { ModalProps, ModalSize } from "./Modal.types";

const SIZE_CLASS: Record<ModalSize, string> = {
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-5xl",
};

/**
 * Dialog primitive.
 *
 * Rendered through a portal into `document.body`. That is load-bearing, not
 * cosmetic: any ancestor with `transform`, `filter`, `backdrop-filter` or
 * `contain` becomes the containing block for `position: fixed` descendants, so
 * an in-tree overlay resolves `inset-0` against that ancestor instead of the
 * viewport. `Navbar`'s `backdrop-blur-md` does exactly that — a modal opened
 * from a navbar widget would be pinned inside the 64px bar.
 *
 * Layout: the overlay is the scroll container; the panel is a flex column
 * capped at the viewport height minus the overlay padding, so its header stays
 * pinned and only the body scrolls, always inside the rounded corners.
 * `my-auto` centres the panel while there is free space and degrades to
 * top-alignment if it ever runs out — the "centred dialog's top is clipped and
 * unreachable" failure cannot happen.
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onHide,
  hideOnClickOutside = true,
  canClose = true,
  closeOnEscape,
  ariaLabel,
  ariaDescribedBy,
  headerContent,
  size = "md",
  className = "",
  closeLabel = "Close",
  dialogLabel = "Dialog",
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const titleId = `${id}-title`;

  // Body scroll lock while mounted.
  useModal();

  const escapeClosesDialog = closeOnEscape ?? (canClose && hideOnClickOutside);
  const { onDialogKeyDown } = useDialogA11y({
    id,
    dialogRef,
    onEscape: escapeClosesDialog ? onHide : undefined,
  });

  // The backdrop is `pointer-events-none`, so the overlay itself is the hit
  // target for every press that misses the panel. `mousedown` rather than
  // `click` so a text selection started inside the panel and released outside
  // doesn't dismiss the dialog.
  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hideOnClickOutside || !onHide) return;
    if (event.button !== 0) return;
    if (event.target !== event.currentTarget) return;
    onHide();
  };

  // `aria-labelledby` may only point at the <h2> the default header actually
  // renders. With `headerContent` that branch is skipped, so the name comes
  // from `ariaLabel`/`title` directly instead of a dangling id reference.
  const rendersDefaultHeader = headerContent === undefined && Boolean(title);
  const accessibleName = rendersDefaultHeader
    ? { "aria-labelledby": titleId }
    : { "aria-label": ariaLabel ?? title ?? dialogLabel };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="animate-fadeIn fixed inset-0 z-9999 flex items-start justify-center overflow-y-auto overscroll-contain p-4"
      onMouseDown={handleOverlayMouseDown}
    >
      <ModalBackdrop />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        {...accessibleName}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        onKeyDown={onDialogKeyDown}
        className={cn(
          // `animate-scaleIn` doubles as a stable hook consumers' browser tests
          // use to locate an open modal — keep it on the panel.
          "animate-scaleIn relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none dark:bg-slate-900 dark:ring-white/10",
          SIZE_CLASS[size],
        )}
      >
        {/* Custom header takes precedence over title; `null` suppresses it. */}
        {headerContent !== undefined ? (
          headerContent != null && headerContent !== false ? (
            <div className="shrink-0">{headerContent}</div>
          ) : null
        ) : (
          <ModalHeader
            title={title}
            titleId={titleId}
            canClose={canClose}
            onHide={onHide}
            closeLabel={closeLabel}
          />
        )}

        {/* Content — the only scroller. `className` merges here. */}
        <div className={cn("min-h-0 overflow-y-auto px-6 py-5", className)}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = "Modal";

export default Modal;
