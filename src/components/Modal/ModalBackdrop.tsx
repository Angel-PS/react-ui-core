import React from "react";
import type { ModalBackdropProps } from "./Modal.types";

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({ hideOnClickOutside, onHide }) => (
  <div
    className="absolute inset-0 bg-black/30 duration-300"
    onClick={hideOnClickOutside ? onHide : undefined}
    aria-hidden="true"
  />
);

ModalBackdrop.displayName = "ModalBackdrop";
