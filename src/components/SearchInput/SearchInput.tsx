import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Accessible label for the clear (X) button. Default: "Clear". */
  clearLabel?: string;
  disabled?: boolean;
}

/**
 * Controlled, dependency-free search box with a leading magnifier and a clear
 * button. State lives in the consumer (`value` / `onChange`) — the library does
 * not own the search term or debounce it.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
  clearLabel = "Clear",
  disabled = false,
}) => {
  return (
    <div
      className={`focus-within:border-primary-blue-default focus-within:ring-primary-blue-light/50 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-xs transition focus-within:ring-2 ${className}`}
    >
      <FontAwesomeIcon
        icon={faSearch}
        className="shrink-0 text-xs text-gray-400 dark:text-slate-500"
        aria-hidden="true"
      />
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-auto flex-1 border-0 bg-transparent px-0 text-sm text-gray-700 dark:text-slate-300 outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          className="bg-transparent p-0 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
