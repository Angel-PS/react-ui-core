import React from "react";
import { useModal } from "./useModal";
import { ModalHeader } from "./ModalHeader";
import { ModalBackdrop } from "./ModalBackdrop";
import type { ModalProps } from "./Modal.types";

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onHide,
  hideOnClickOutside = true,
  canClose = true,
}) => {
  useModal({ onHide });

  return (
    <div className="animate-fadeIn fixed inset-0 z-9999 flex items-center justify-center p-4">
      <ModalBackdrop hideOnClickOutside={hideOnClickOutside} onHide={onHide} />

      <div className="animate-scaleIn relative z-50 w-full max-w-xl">
        <div className="relative transform rounded-2xl bg-white shadow-2xl transition-all">
          <ModalHeader title={title} canClose={canClose} onHide={onHide} />

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
