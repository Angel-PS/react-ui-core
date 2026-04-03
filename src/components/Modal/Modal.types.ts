import React from "react";

export interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onHide?: () => void;
  hideOnClickOutside?: boolean;
  canClose?: boolean;
}

export interface ModalHeaderProps {
  title?: string;
  canClose: boolean;
  onHide?: () => void;
}

export interface ModalBackdropProps {
  hideOnClickOutside: boolean;
  onHide?: () => void;
}
