import React, { forwardRef, useId } from "react";
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
  /** Helper text under the field, wired through `aria-describedby`. */
  hint?: React.ReactNode;
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
      hint,
      className = "",
      ...props
    },
    ref,
  ) => {
    const selectClass = `input w-full appearance-none pr-9 ${className} ${error ? "error-input" : ""}`;
    // `htmlFor` matches an `id`, not a `name` — without this the label pointed
    // at nothing and clicking it did not focus the control (same as Input).
    const autoId = useId();
    const controlId = props.id ?? props.name ?? autoId;
    const errorId = `${controlId}-error`;
    const hintId = `${controlId}-hint`;
    const describedBy =
      [
        props["aria-describedby"],
        error ? errorId : undefined,
        hint ? hintId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;
    const ariaInvalid = props["aria-invalid"] ?? (error ? true : undefined);

    return (
      <div className="relative block w-full">
        {label && (
          <label htmlFor={controlId} className="label flex items-center gap-1">
            {label}
            {required && <span className="text-alerts-error">*</span>}
          </label>
        )}
        {!loading ? (
          <div className="relative">
            <select
              ref={ref}
              className={selectClass}
              {...props}
              id={controlId}
              aria-invalid={ariaInvalid}
              aria-describedby={describedBy}
            >
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
          // In normal flow — see the note in Input.tsx.
          <span
            id={errorId}
            role="alert"
            className="text-alerts-error mt-1 block text-xs font-medium"
          >
            {error}
          </span>
        )}
        {hint && (
          <p id={hintId} className="text-muted-foreground mt-1 mb-0 text-xs">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
