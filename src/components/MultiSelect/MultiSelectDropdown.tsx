import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { MultiSelectDropdownProps } from "./MultiSelect.types";
import styles from "./MultiSelect.module.css";

const PORTAL_STATIC_STYLE: React.CSSProperties = {
  position: "fixed",
  zIndex: 9999,
};

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  portalRef,
  searchTerm,
  filteredOptions,
  selectedIds,
  onSearchChange,
  onToggleOption,
}) => (
  <div ref={portalRef} style={PORTAL_STATIC_STYLE} className={styles.dropdown}>
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={styles.searchInput}
        autoFocus
      />
    </div>

    <div className={styles.optionsList}>
      {filteredOptions.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? "No se encontraron resultados" : "No hay opciones"}
        </div>
      ) : (
        filteredOptions.map((option) => {
          const isSelected = selectedIds.includes(option.value);
          return (
            <div
              key={option.value}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
              onClick={() => onToggleOption(option.value)}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className={styles.checkIcon}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);
