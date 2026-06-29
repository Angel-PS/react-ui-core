import React from "react";

export type ModalSize = "md" | "lg" | "xl" | "2xl";

export interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onHide?: () => void;
  hideOnClickOutside?: boolean;
  canClose?: boolean;
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
}

export interface ModalHeaderProps {
  title?: string;
  canClose: boolean;
  onHide?: () => void;
  closeLabel?: string;
}

export interface ModalBackdropProps {
  hideOnClickOutside: boolean;
  onHide?: () => void;
}
