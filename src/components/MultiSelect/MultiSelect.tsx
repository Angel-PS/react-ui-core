import React from "react";
import { createPortal } from "react-dom";
import { useMultiSelect } from "./useMultiSelect";
import { MultiSelectTrigger } from "./MultiSelectTrigger";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import type { MultiSelectProps } from "./MultiSelect.types";
import styles from "./MultiSelect.module.css";

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
    <div className={styles.container} ref={containerRef}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {color && (
          <div
            className={styles.colorDot}
            style={{ backgroundColor: color }}
          />
        )}
      </label>

      {!loading ? (
        <div className={styles.selectWrapper}>
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
        <div className={styles.skeleton} />
      )}

      {error && (
        <span title={error} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
