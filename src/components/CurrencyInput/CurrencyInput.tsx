import React, { forwardRef, useId, useState } from "react";
import { formatDecimal } from "../../lib/format";

export interface CurrencyInputProps {
  label?: string;
  error?: string | null;
  /**
   * Helper text under the field. Wired to the control through
   * `aria-describedby`, so it is announced together with the label.
   */
  hint?: React.ReactNode;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Decimal places used when the value is formatted on blur. Default 2. */
  decimals?: number;
  /** Select the whole value on focus. */
  selectAll?: boolean;
  /**
   * Values below this are raised to it when the field loses focus (not while
   * typing, so "0.75" can be typed on the way to a larger number).
   */
  minValue?: number;
  /** Typed values above this are clamped down to it immediately. */
  maxValue?: number;
  name?: string;
  id?: string;
  /**
   * The numeric value. `null`, `undefined` or `NaN` renders an empty field.
   */
  value: number | null | undefined;
  /**
   * Called with the parsed number on every keystroke, with `null` when the
   * field is cleared, and once more on blur when rounding to `decimals` or
   * `minValue` changes the number — so the form value always equals what the
   * field shows.
   */
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  "aria-describedby"?: string;
}

export function clampNumber(
  value: number,
  minValue?: number,
  maxValue?: number,
): number {
  let next = value;
  if (typeof minValue === "number" && next < minValue) next = minValue;
  if (typeof maxValue === "number" && next > maxValue) next = maxValue;
  return next;
}

function coerceNumeric(
  value: number | string | null | undefined,
): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return isNaN(n) ? null : n;
}

/** Keeps digits and the first `.`; returns the number and the cleaned text. */
export function parseCurrencyText(input: string): {
  numeric: number;
  rawText: string;
} {
  const stripped = input.replace(/[^\d.]/g, "");
  const parts = stripped.split(".");
  const intPart = parts[0] ?? "";
  const decPart = parts.length > 1 ? parts.slice(1).join("") : "";
  const rebuilt = parts.length > 1 ? `${intPart}.${decPart}` : intPart;
  const numeric = rebuilt === "" || rebuilt === "." ? 0 : Number(rebuilt);
  return { numeric: isNaN(numeric) ? 0 : numeric, rawText: rebuilt };
}

/**
 * Groups the integer digits while typing ("1234.5" → "1,234.5") without
 * padding decimals, so the caret never fights a half-typed number.
 */
export function formatCurrencyLive(rawText: string): string {
  if (rawText === "") return "";
  const [intRaw, ...decRest] = rawText.split(".");
  const intDigits = intRaw.replace(/^0+(?=\d)/, "") || "0";
  const grouped = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decRest.length > 0 ? `${grouped}.${decRest.join("")}` : grouped;
}

/**
 * A money field: groups thousands as you type, clamps to `minValue`/`maxValue`,
 * and formats to `decimals` places on blur. The value is a plain number —
 * currency symbols and locale rules belong to the consumer.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      error,
      hint,
      loading,
      required = false,
      disabled,
      placeholder,
      className = "",
      decimals = 2,
      selectAll,
      minValue,
      maxValue,
      name,
      id,
      value,
      onChange,
      onBlur,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    const [display, setDisplay] = useState<string>(() => {
      const n = coerceNumeric(value);
      return n == null ? "" : formatDecimal(n, decimals);
    });
    const [prevValue, setPrevValue] = useState(value);
    const [prevDecimals, setPrevDecimals] = useState(decimals);
    const [isFocused, setIsFocused] = useState(false);

    // Re-sync from the controlled value only while the field is not being
    // edited, so outside updates (a form reset, a recalculated total) show up
    // without overwriting what the user is typing. `Object.is` — not `!==` —
    // because `NaN !== NaN` would re-sync on every render and loop forever.
    if (
      !isFocused &&
      (!Object.is(prevValue, value) || prevDecimals !== decimals)
    ) {
      setPrevValue(value);
      setPrevDecimals(decimals);
      const n = coerceNumeric(value);
      setDisplay(n == null ? "" : formatDecimal(n, decimals));
    }

    const autoId = useId();
    const controlId = id ?? name ?? autoId;
    const errorId = `${controlId}-error`;
    const hintId = `${controlId}-hint`;
    const describedBy =
      [ariaDescribedBy, error ? errorId : undefined, hint ? hintId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const inputClass = `base-input w-full tabular-nums ${className} ${
      error ? "border-alerts-error" : ""
    }`;

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(true);
      if (selectAll) e.target.select();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { numeric, rawText } = parseCurrencyText(e.target.value);
      if (rawText === "") {
        setDisplay("");
        onChange(null);
        return;
      }
      const clamped = clampNumber(numeric, undefined, maxValue);
      onChange(clamped);
      setDisplay(
        formatCurrencyLive(clamped === numeric ? rawText : String(clamped)),
      );
    }

    function handleBlur() {
      setIsFocused(false);
      const coerced = coerceNumeric(value);
      if (coerced == null) {
        // An empty field stays empty: it is the form's job to say whether a
        // value is required, not this field's to invent a 0.
        setDisplay("");
        onBlur?.();
        return;
      }
      const shown = formatDecimal(
        clampNumber(coerced, minValue, maxValue),
        decimals,
      );
      // Commit exactly what is displayed, so a 2-decimal rule never fires
      // under a field that reads "1.01" while the form still holds 1.005.
      const committed = Number(shown.replace(/,/g, ""));
      setDisplay(shown);
      if (!Object.is(committed, coerced)) onChange(committed);
      onBlur?.();
    }

    return (
      <div className="relative block w-full">
        {label && (
          <label
            htmlFor={controlId}
            className="label flex place-items-center gap-2"
          >
            {label}
            {required && <span className="text-alerts-error ml-1">*</span>}
          </label>
        )}
        {!loading ? (
          <input
            ref={ref}
            id={controlId}
            name={name}
            className={inputClass}
            aria-required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            autoComplete="off"
            inputMode="decimal"
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            value={display}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <div className="skeleton h-10.75"></div>
        )}
        {error && (
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

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
