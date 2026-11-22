import React, { useId } from "react";
import { createPortal } from "react-dom";
import { useMultiSelect } from "./useMultiSelect";
import { MultiSelectTrigger } from "./MultiSelectTrigger";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import type {
  MultiSelectLabels,
  MultiSelectProps,
} from "./MultiSelect.types";

export const DEFAULT_MULTISELECT_LABELS: MultiSelectLabels = {
  placeholder: "Select an option",
  search: "Search...",
  noOptions: "No options",
  noResults: "No results found",
  selectedCount: (count) => `${count} selected`,
  removeItem: (label) => `Remove ${label}`,
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  name,
  options = [],
  value = [],
  error = null,
  loading = false,
  className = "",
  placeholder,
  disabled = false,
  color,
  maxSelectedDisplay = 3,
  required = false,
  onChange,
  labels: labelsProp,
}) => {
  const labels = { ...DEFAULT_MULTISELECT_LABELS, ...labelsProp };
  // The trigger is a `div role="button"`, which `<label htmlFor>` cannot target,
  // so the label names it through `aria-labelledby` and focuses it on click.
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const errorId = `${baseId}-error`;
  const {
    isOpen,
    selectedIds,
    searchTerm,
    selectedOptions,
    filteredOptions,
    selectClass,
    containerRef,
    triggerRef,
    portalRef,
    setIsOpen,
    setSearchTerm,
    handleToggleOption,
    handleRemoveTag,
  } = useMultiSelect({
    options,
    value,
    name,
    onChange,
    disabled,
    error,
    className,
  });

  const displayText = (() => {
    if (selectedOptions.length === 0)
      return placeholder ?? labels.placeholder;
    if (selectedOptions.length <= maxSelectedDisplay) return null;
    return labels.selectedCount(selectedOptions.length);
  })();

  return (
    <div className="relative block w-full mb-4" ref={containerRef}>
      <label
        id={labelId}
        onClick={() => {
          if (!disabled) triggerRef.current?.focus();
        }}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
        {color && (
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
      </label>

      {!loading ? (
        <div className="relative h-10.75 rounded-[0.3125rem]">
          <MultiSelectTrigger
            triggerRef={triggerRef}
            labelId={labelId}
            errorId={error ? errorId : undefined}
            invalid={Boolean(error)}
            removeItemLabel={labels.removeItem}
            selectClass={selectClass}
            isOpen={isOpen}
            disabled={disabled}
            displayText={displayText}
            selectedOptions={selectedOptions}
            onToggleOpen={() => !disabled && setIsOpen(!isOpen)}
            onRemoveTag={handleRemoveTag}
          />

          {isOpen &&
            !disabled &&
            createPortal(
              <MultiSelectDropdown
                portalRef={portalRef}
                labels={labels}
                searchTerm={searchTerm}
                filteredOptions={filteredOptions}
                selectedIds={selectedIds}
                onSearchChange={setSearchTerm}
                onToggleOption={handleToggleOption}
              />,
              document.body,
            )}
        </div>
      ) : (
        <div className="skeleton h-10.75 rounded-[0.3125rem]" />
      )}

      {error && (
        // In normal flow — see the note in Input.tsx.
        <span
          id={errorId}
          role="alert"
          className="mt-1 block text-sm text-red-500"
        >
          {error}
        </span>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
