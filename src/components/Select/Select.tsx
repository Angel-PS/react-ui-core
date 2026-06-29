import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { Option } from "../../types";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
  loading?: boolean;
  required?: boolean;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      loading,
      required = false,
      options,
      placeholder,
      className = "",
      ...props
    },
    ref,
  ) => {
    const selectClass = `input w-full appearance-none pr-9 ${className} ${error ? "error-input" : ""}`;

    return (
      <div className="relative block w-full">
        {label && (
          <label htmlFor={props.name} className="label flex items-center gap-1">
            {label}
            {required && <span className="text-alerts-error">*</span>}
          </label>
        )}
        {!loading ? (
          <div className="relative">
            <select ref={ref} className={selectClass} {...props}>
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500"
            />
          </div>
        ) : (
          <div className="skeleton h-10.75"></div>
        )}
        {error && (
          <span
            title={error}
            className="text-alerts-error absolute left-0 max-w-full truncate overflow-hidden text-xs font-medium"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
