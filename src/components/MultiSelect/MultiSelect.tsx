import React from "react";
import { createPortal } from "react-dom";
import { useMultiSelect } from "./useMultiSelect";
import { MultiSelectTrigger } from "./MultiSelectTrigger";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import type { MultiSelectProps } from "./MultiSelect.types";

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
}) => {
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
      return placeholder ?? "Selecciona una opción";
    if (selectedOptions.length <= maxSelectedDisplay) return null;
    return `${selectedOptions.length} item seleccionado`;
  })();

  return (
    <div className="relative block w-full mb-4" ref={containerRef}>
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
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
        <div className="relative h-[2.6875rem] rounded-[5px]">
          <MultiSelectTrigger
            triggerRef={triggerRef}
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
        <div className="skeleton h-[2.6875rem] rounded-[5px]" />
      )}

      {error && (
        <span title={error} className="absolute left-0 mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
