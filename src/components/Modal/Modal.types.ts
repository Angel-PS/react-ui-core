import React from "react";

export type ModalSize = "md" | "lg" | "xl" | "2xl";

export interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onHide?: () => void;
  /** Close when the overlay outside the panel is pressed. Default: true. */
  hideOnClickOutside?: boolean;
  /** Show the close (X) button. Default: true. */
  canClose?: boolean;
  /**
   * Whether Escape closes the dialog. Defaults to
   * `canClose && hideOnClickOutside`, so a modal that already opted out of
   * backdrop dismissal (a form mid-edit, a mandatory prompt, a dialog whose
   * `onHide` performs a mutation) doesn't gain a keyboard dismissal path it
   * never asked for.
   */
  closeOnEscape?: boolean;
  /**
   * Accessible name when the built-in `<h2>` title is not rendered (i.e. with
   * `headerContent`). Falls back to `title`, then to `dialogLabel`.
   */
  ariaLabel?: string;
  /** Id of the element that describes the dialog (`aria-describedby`). */
  ariaDescribedBy?: string;
  /**
   * Custom header. Takes precedence over `title`. Pass `null` to suppress the
   * built-in header entirely (e.g. ConfirmDialog renders its own close button).
   */
  headerContent?: React.ReactNode;
  size?: ModalSize;
  /** Extra classes merged onto the scrollable content area. */
  className?: string;
  /** Accessible label for the close (X) button. Default: "Close". */
  closeLabel?: string;
  /** Last-resort accessible name of the dialog. Default: "Dialog". */
  dialogLabel?: string;
}

export interface ModalHeaderProps {
  title?: string;
  /** Id put on the `<h2>` so the dialog can reference it (`aria-labelledby`). */
  titleId?: string;
  canClose: boolean;
  onHide?: () => void;
  closeLabel?: string;
}
