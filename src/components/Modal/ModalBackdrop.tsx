import React from "react";
import type { ModalBackdropProps } from "./Modal.types";

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  hideOnClickOutside,
  onHide,
}) => (
  <div
    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm duration-300"
    onClick={hideOnClickOutside ? onHide : undefined}
    aria-hidden="true"
  />
);

ModalBackdrop.displayName = "ModalBackdrop";
