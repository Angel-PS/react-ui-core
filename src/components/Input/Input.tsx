import React, { forwardRef, useId } from "react";
import { InputMask } from "@react-input/mask";
import type { InputProps } from "./Input.types";

/**
 * Drops only *redundant* leading zeros: "05" → "5", "007" → "7", "-05" → "-5".
 * A lone "0", a decimal like "0.5" and a partial "0." are left untouched — the
 * old blanket `startsWith("0")` strip made those impossible to type.
 */
const stripRedundantLeadingZeros = (value: string): string =>
  value.replace(/^(-?)0+(?=\d)/, "$1");

/**
 * Writes `value` the way typing would, so React's `onChange` (and therefore
 * react-hook-form and controlled consumers) sees it. A plain `el.value = x`
 * outside an input event is invisible to React's change tracking.
 */
const commitValue = (el: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
};

/** The `onInput` event type, whatever @types/react version the consumer has. */
type InputEventArg = Parameters<
  NonNullable<React.InputHTMLAttributes<HTMLInputElement>["onInput"]>
>[0];

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      labelBtn,
      showBtn,
      error,
      hint,
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
      digitsOnly,
      onInput,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    // `htmlFor` matches an `id`, not a `name`. Without this the label was never
    // programmatically tied to its control: screen readers announced an
    // unlabelled field and clicking the label did nothing.
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

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (selectAll) {
        e.target.select();
      }
      onFocus?.(e);
    };

    const handleInput = (e: InputEventArg) => {
      const el = e.currentTarget;
      let next = el.value;
      if (digitsOnly) next = next.replace(/\D/g, "");
      if (type === "number") next = stripRedundantLeadingZeros(next);
      if (maxLength && next.length > maxLength) next = next.slice(0, maxLength);
      if (maxValue !== undefined && next !== "" && Number(next) > maxValue) {
        next = maxValue.toString();
      }
      // Assign only on a real change: rewriting an identical value moves the
      // caret to the end in some browsers.
      if (next !== el.value) el.value = next;
      onInput?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      if (
        minValue !== undefined &&
        el.value !== "" &&
        Number(el.value) < minValue
      ) {
        commitValue(el, minValue.toString());
      }
      onBlur?.(e);
    };

    const inputClass = `base-input w-full ${className} ${
      error ? "border-alerts-error" : ""
    }`;

    return (
      <div className="relative block w-full">
        {label && (
          <label
            htmlFor={controlId}
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
                id={controlId}
                aria-invalid={ariaInvalid}
                aria-describedby={describedBy}
                ref={ref}
                type={type}
                className={inputClass}
                aria-required={required}
                autoComplete="off"
                onFocus={handleFocus}
                onInput={onInput}
                onBlur={onBlur}
              />
            ) : (
              <input
                ref={ref}
                className={inputClass}
                aria-required={required}
                autoComplete="off"
                type={type}
                {...props}
                id={controlId}
                aria-invalid={ariaInvalid}
                aria-describedby={describedBy}
                onFocus={handleFocus}
                onInput={handleInput}
                onBlur={handleBlur}
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
          // In normal flow, not absolutely positioned: an overlaid message sits
          // on top of whatever the consumer renders under the field (hint copy,
          // a password-rules checklist). Costs ~16px of height while an error is
          // showing; that is preferable to unreadable stacked text.
          <span
            id={errorId}
            role="alert"
            className="text-alerts-error mt-1 block text-xs font-medium"
          >
            {error}
          </span>
        )}
        {hint && (
          <p
            id={hintId}
            className="text-muted-foreground mt-1 mb-0 text-xs"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
