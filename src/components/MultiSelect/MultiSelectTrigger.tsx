import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import type { MultiSelectTriggerProps } from "./MultiSelect.types";

export const MultiSelectTrigger: FC<MultiSelectTriggerProps> = ({
  triggerRef,
  selectClass,
  isOpen,
  disabled,
  displayText,
  selectedOptions,
  onToggleOpen,
  onRemoveTag,
}) => (
  <div
    ref={triggerRef}
    className={selectClass}
    onClick={onToggleOpen}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggleOpen();
      }
    }}
  >
    <div className="flex min-h-6 flex-1 flex-wrap items-center gap-2 px-3 py-1">
      {displayText ? (
        <span className="text-gray-400">{displayText}</span>
      ) : (
        selectedOptions.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => onRemoveTag(option.value, e)}
              className="inline-flex items-center justify-center h-4 w-4 rounded-full border-0 bg-transparent text-blue-600 cursor-pointer p-0 leading-none hover:bg-blue-200 hover:text-blue-800 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </span>
        ))
      )}
    </div>

    <FontAwesomeIcon
      icon={faChevronDown}
      className={`shrink-0 mr-2 h-4 w-4 text-[0.7rem] text-gray-800 transition-transform duration-200${isOpen ? " rotate-180" : ""}`}
    />
  </div>
);
