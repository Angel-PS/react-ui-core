import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { MultiSelectDropdownProps } from "./MultiSelect.types";

const PORTAL_STATIC_STYLE: React.CSSProperties = {
  position: "fixed",
  zIndex: 9999,
};

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  portalRef,
  labels,
  searchTerm,
  filteredOptions,
  selectedIds,
  onSearchChange,
  onToggleOption,
}) => (
  <div ref={portalRef} style={PORTAL_STATIC_STYLE} className="flex max-h-72 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
    <div className="border-b border-gray-100 p-2 shadow-sm dark:border-slate-800">
      <input
        type="text"
        placeholder={labels.search}
        aria-label={labels.search}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-600 box-border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
        autoFocus
      />
    </div>

    <div className="overflow-auto">
      {filteredOptions.length === 0 ? (
        <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-slate-400">
          {searchTerm ? labels.noResults : labels.noOptions}
        </div>
      ) : (
        filteredOptions.map((option) => {
          const isSelected = selectedIds.includes(option.value);
          return (
            <div
              key={option.value}
              className={`flex cursor-pointer items-center justify-between px-4 py-3 text-gray-900 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800${isSelected ? " bg-blue-50 text-blue-900 hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/40" : ""}`}
              onClick={() => onToggleOption(option.value)}
            >
              <span className="flex-1 text-sm font-medium">{option.label}</span>
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  aria-hidden="true"
                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);
