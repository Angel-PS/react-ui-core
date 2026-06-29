import React, { forwardRef } from "react";
import { InputMask } from "@react-input/mask";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      labelBtn,
      showBtn,
      error,
      loading,
      className = "",
      replacement = { _: /\d/ },
      mask,
      onClickBtn,
      color,
      selectAll,
      required = false,
      maxLength,
      maxValue,
      minValue,
      formatDecimals,
      ...props
    },
    ref,
  ) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (selectAll) {
        e.target.select();
      }
      props.onFocus?.(e);
    };
    const inputClass = `base-input w-full ${className} ${
      error ? "border-alerts-error" : ""
    }`;

    return (
      <div className="relative block w-full">
        {label && (
          <label
            htmlFor={props.name}
            className="label flex place-items-center gap-2"
          >
            {label}
            {required && <span className="text-alerts-error ml-1">*</span>}
            {color && (
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            )}
          </label>
        )}
        {!loading ? (
          <div className="flex">
            {mask ? (
              <InputMask
                mask={mask}
                replacement={replacement}
                {...props}
                ref={ref}
                type={type}
                className={inputClass}
                aria-required={required}
                autoComplete="off"
                onFocus={handleFocus}
              />
            ) : (
              <input
                ref={ref}
                className={inputClass}
                aria-required={required}
                autoComplete="off"
                type={type}
                onFocus={handleFocus}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  if (
                    type === "number" &&
                    e.currentTarget.value.startsWith("0")
                  ) {
                    e.currentTarget.value = e.currentTarget.value.slice(
                      1,
                      e.currentTarget.value.length,
                    );
                  }
                  if (maxLength && e.currentTarget.value.length > maxLength) {
                    e.currentTarget.value = e.currentTarget.value.slice(
                      0,
                      maxLength,
                    );
                  }
                  if (maxValue && Number(e.currentTarget.value) > maxValue) {
                    e.currentTarget.value = maxValue.toString();
                  }
                  if (
                    (minValue || minValue === 0) &&
                    (Number(e.currentTarget.value) < minValue ||
                      e.currentTarget.value === "")
                  ) {
                    e.currentTarget.value = minValue.toString();
                  }
                }}
                {...props}
              />
            )}
            {showBtn && (
              <button
                type="button"
                className="ml-4"
                onClick={onClickBtn && onClickBtn}
              >
                {labelBtn}
              </button>
            )}
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

Input.displayName = "Input";

export default Input;
