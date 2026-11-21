import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import type { MultiSelectTriggerProps } from "./MultiSelect.types";

export const MultiSelectTrigger: FC<MultiSelectTriggerProps> = ({
  triggerRef,
  labelId,
  errorId,
  invalid,
  removeItemLabel,
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
    tabIndex={disabled ? -1 : 0}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-disabled={disabled || undefined}
    aria-labelledby={labelId}
    aria-invalid={invalid || undefined}
    aria-describedby={errorId}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggleOpen();
      }
    }}
  >
    <div className="flex min-h-6 flex-1 flex-wrap items-center gap-2 px-3 py-1">
      {displayText ? (
        <span className="text-gray-400 dark:text-slate-500">{displayText}</span>
      ) : (
        selectedOptions.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
          >
            {option.label}
            <button
              type="button"
              aria-label={removeItemLabel(String(option.label))}
              onClick={(e) => onRemoveTag(option.value, e)}
              className="inline-flex items-center justify-center h-4 w-4 rounded-full border-0 bg-transparent text-blue-600 cursor-pointer p-0 leading-none hover:bg-blue-200 hover:text-blue-800 disabled:cursor-not-allowed dark:text-blue-300 dark:hover:bg-blue-900/60 dark:hover:text-blue-200"
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faX} aria-hidden="true" />
            </button>
          </span>
        ))
      )}
    </div>

    <FontAwesomeIcon
      icon={faChevronDown}
      aria-hidden="true"
      className={`shrink-0 mr-2 h-4 w-4 text-[0.7rem] text-gray-800 dark:text-slate-300 transition-transform duration-200${isOpen ? " rotate-180" : ""}`}
    />
  </div>
);
