import { forwardRef } from "react";
import { useInput } from "./useInput";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      error,
      loading,
      className = "",
      required = false,
      maxLength,
      maxValue,
      minValue,
      prefix,
      prefixColor,
      size = "md",
      disabled,
      ...props
    },
    ref,
  ) => {
    const {
      hasPrefix,
      wrapperClass,
      inputClass,
      innerInputClass,
      prefixClass,
      skeletonClass,
      handleInput,
    } = useInput({
      type,
      error,
      className,
      maxLength,
      maxValue,
      minValue,
      onInput: props.onInput,
      disabled,
      prefix,
      size,
    });

    return (
      <div className="relative block w-full">
        {label && (
          <label htmlFor={props.name} className="label flex items-center gap-1">
            {label}
            {required && <span className="text-alerts-error">*</span>}
          </label>
        )}

        {!loading ? (
          hasPrefix ? (
            <div className={wrapperClass}>
              <span
                className={prefixClass}
                style={prefixColor ? { color: prefixColor } : undefined}
              >
                {prefix}
              </span>
              <input
                {...props}
                ref={ref}
                className={innerInputClass}
                aria-required={required}
                aria-invalid={!!error}
                autoComplete="off"
                type={type}
                disabled={disabled}
                onInput={handleInput}
              />
            </div>
          ) : (
            <input
              {...props}
              ref={ref}
              className={inputClass}
              aria-required={required}
              aria-invalid={!!error}
              autoComplete="off"
              type={type}
              disabled={disabled}
              onInput={handleInput}
            />
          )
        ) : (
          <div className={skeletonClass} />
        )}

        {error && (
          <span
            title={error}
            className="text-alerts-error absolute left-0 max-w-full truncate overflow-hidden text-sm"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
