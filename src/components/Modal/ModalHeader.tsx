import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { ModalHeaderProps } from "./Modal.types";

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, canClose, onHide }) => {
  if (!title && !onHide) return null;

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
      {title && (
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
      )}
      {canClose && onHide && (
        <button
          onClick={onHide}
          className="cursor-pointer border-0 bg-transparent p-0 focus:outline-none"
          aria-label="Close modal"
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-lg text-gray-500 hover:text-gray-700"
          />
        </button>
      )}
    </div>
  );
};

ModalHeader.displayName = "ModalHeader";
