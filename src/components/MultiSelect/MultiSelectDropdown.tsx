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
  searchTerm,
  filteredOptions,
  selectedIds,
  onSearchChange,
  onToggleOption,
}) => (
  <div ref={portalRef} style={PORTAL_STATIC_STYLE} className="flex max-h-72 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
    <div className="border-b border-gray-100 p-2 shadow-sm">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-600 box-border"
        autoFocus
      />
    </div>

    <div className="overflow-auto">
      {filteredOptions.length === 0 ? (
        <div className="px-4 py-3 text-center text-sm text-gray-500">
          {searchTerm ? "No se encontraron resultados" : "No hay opciones"}
        </div>
      ) : (
        filteredOptions.map((option) => {
          const isSelected = selectedIds.includes(option.value);
          return (
            <div
              key={option.value}
              className={`flex cursor-pointer items-center justify-between px-4 py-3 text-gray-900 transition-colors duration-150 hover:bg-slate-100${isSelected ? " bg-blue-50 text-blue-900 hover:bg-blue-50" : ""}`}
              onClick={() => onToggleOption(option.value)}
            >
              <span className="flex-1 text-sm font-medium">{option.label}</span>
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="h-4 w-4 text-blue-600"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);
