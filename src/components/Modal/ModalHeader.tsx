import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { ModalHeaderProps } from "./Modal.types";

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  canClose,
  onHide,
  closeLabel = "Close",
}) => {
  if (!title && !onHide) return null;

  return (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-5">
      {title && (
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
          {title}
        </h2>
      )}
      {canClose && onHide && (
        <button
          onClick={onHide}
          className="-mr-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-gray-400 dark:text-slate-500 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-slate-300 focus-visible:ring-2 focus-visible:ring-primary-blue-light focus:outline-none"
          aria-label={closeLabel}
        >
          <FontAwesomeIcon icon={faXmark} className="text-lg" />
        </button>
      )}
    </div>
  );
};

ModalHeader.displayName = "ModalHeader";
