import React from "react";
import { useModal } from "./useModal";
import { ModalHeader } from "./ModalHeader";
import { ModalBackdrop } from "./ModalBackdrop";
import { cn } from "../../lib/utils";
import type { ModalProps, ModalSize } from "./Modal.types";

const SIZE_CLASS: Record<ModalSize, string> = {
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-5xl",
};

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onHide,
  hideOnClickOutside = true,
  canClose = true,
  headerContent,
  size = "md",
  className = "",
  closeLabel = "Close",
}) => {
  // ESC-to-close + body scroll lock while mounted.
  useModal({ onHide });

  return (
    <div className="animate-fadeIn fixed inset-0 z-9999 flex items-center justify-center p-4">
      <ModalBackdrop hideOnClickOutside={hideOnClickOutside} onHide={onHide} />

      <div
        className={`animate-scaleIn relative z-50 w-full ${SIZE_CLASS[size]}`}
      >
        <div className="relative transform rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all">
          {/* Custom header takes precedence over title; `null` suppresses it. */}
          {headerContent !== undefined ? (
            headerContent
          ) : (
            <ModalHeader
              title={title}
              canClose={canClose}
              onHide={onHide}
              closeLabel={closeLabel}
            />
          )}

          <div
            className={cn(
              "max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-5",
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export default Modal;
