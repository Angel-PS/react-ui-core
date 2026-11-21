import React, { forwardRef, useCallback, useEffect, useId, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/utils";

export interface ColorInputLabels {
  /** aria-label of the swatch button that opens the presets popover. */
  openPresets: string;
  /** aria-label of the presets popover. */
  presetsDialog: string;
  /** Label of the native color picker row. */
  custom: string;
  /** aria-label of each preset swatch. */
  swatch: (hex: string) => string;
}

export const DEFAULT_COLOR_INPUT_LABELS: ColorInputLabels = {
  openPresets: "Choose a color",
  presetsDialog: "Color presets",
  custom: "Custom",
  swatch: (hex) => hex,
};

export interface ColorInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  label?: string;
  error?: string | null;
  /**
   * Helper text under the field. Wired to the control through
   * `aria-describedby`, so it is announced together with the label.
   */
  hint?: React.ReactNode;
  loading?: boolean;
  required?: boolean;
  /** The hex value, e.g. `#4061A8`. */
  value?: string;
  /** Called with the typed (with a leading `#`) or picked (upper-case) hex. */
  onChange?: (value: string) => void;
  /** Swatches in the popover. Defaults to a brand-led 16-colour palette. */
  presets?: string[];
  labels?: Partial<ColorInputLabels>;
}

export const DEFAULT_COLOR_PRESETS = [
  "#4061A8", // brand blue
  "#2F4CBC", // brand dark
  "#1F337E", // brand darker
  "#2563EB",
  "#0EA5E9",
  "#06B6D4",
  "#10B981", // success
  "#22C55E",
  "#F59E0B", // amber accent
  "#F97316",
  "#EF4444", // danger
  "#EC4899",
  "#A855F7",
  "#64748B", // slate
  "#1F2937",
  "#FFFFFF",
];

const HEX_PATTERN = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

/** `#RGB` or `#RRGGBB`, case-insensitive. */
export const isHexColor = (value: string): boolean => HEX_PATTERN.test(value);

/** Trims and adds the leading `#` the user left out; empty stays empty. */
export const normalizeHex = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

/**
 * A hex colour field: type a value, or open the swatch to pick a preset or a
 * custom colour from the native picker. Validation (is the hex well-formed?)
 * is the consumer's call — pass the message through `error`.
 */
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  (
    {
      label,
      error,
      hint,
      loading,
      required = false,
      value = "",
      onChange,
      onBlur,
      name,
      id,
      placeholder = "#RRGGBB",
      presets = DEFAULT_COLOR_PRESETS,
      className = "",
      disabled,
      labels,
      ...props
    },
    ref,
  ) => {
    const copy = { ...DEFAULT_COLOR_INPUT_LABELS, ...labels };
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => {
      setText(value);
    }, [value]);

    const close = useCallback(() => setOpen(false), []);
    const containerRef = useClickOutside<HTMLDivElement>(close);

    const autoId = useId();
    const controlId = id ?? name ?? autoId;
    const errorId = `${controlId}-error`;
    const hintId = `${controlId}-hint`;
    const popoverId = `${controlId}-presets`;
    const describedBy =
      [
        props["aria-describedby"],
        error ? errorId : undefined,
        hint ? hintId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const emit = (next: string) => {
      setText(next);
      onChange?.(next);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      emit(normalizeHex(e.target.value));
    };

    const handlePick = (hex: string) => {
      emit(hex.toUpperCase());
    };

    // Escape closes the popover only. preventDefault tells an enclosing dialog
    // (Modal / useDialogA11y) that the key was consumed, so it stays open.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    const valid = isHexColor(text);
    const inputClass = `base-input w-full pl-10 font-mono ${className} ${
      error ? "border-alerts-error" : ""
    }`;

    return (
      <div
        className="relative block w-full"
        ref={containerRef}
        onKeyDown={handleKeyDown}
      >
        {label && (
          <label htmlFor={controlId} className="label flex items-center gap-2">
            {label}
            {required && <span className="text-alerts-error ml-1">*</span>}
          </label>
        )}

        {!loading ? (
          <div className="relative flex">
            <button
              type="button"
              aria-label={copy.openPresets}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? popoverId : undefined}
              onClick={() => !disabled && setOpen((prev) => !prev)}
              disabled={disabled}
              className={cn(
                "absolute top-1/2 left-1.5 h-6 w-6 -translate-y-1/2 rounded-md border border-gray-300 shadow-sm transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700",
                !valid && "border-dashed bg-white shadow-none dark:bg-slate-900",
              )}
              style={valid ? { backgroundColor: text } : undefined}
            />
            <input
              ref={ref}
              id={controlId}
              name={name}
              type="text"
              value={text}
              onChange={handleTextChange}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              aria-required={required}
              aria-invalid={error ? true : undefined}
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              {...props}
              aria-describedby={describedBy}
            />
          </div>
        ) : (
          <div className="skeleton h-10.75" />
        )}

        {open && (
          <div
            id={popoverId}
            role="dialog"
            aria-label={copy.presetsDialog}
            className="animate-fadeIn absolute z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 grid grid-cols-8 gap-1.5">
              {presets.map((preset) => {
                const isSelected = preset.toUpperCase() === text.toUpperCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-label={copy.swatch(preset)}
                    aria-pressed={isSelected}
                    onClick={() => handlePick(preset)}
                    className={cn(
                      "h-6 w-6 rounded-md border transition hover:scale-110",
                      isSelected
                        ? "border-primary-blue-default ring-primary-blue-default ring-2 ring-offset-1 dark:ring-offset-slate-900"
                        : "border-gray-200 dark:border-slate-800",
                    )}
                    style={{ backgroundColor: preset }}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-slate-800">
              <label
                htmlFor={`${controlId}-native`}
                className="m-0 text-xs font-normal text-gray-500 dark:text-slate-400"
              >
                {copy.custom}
              </label>
              <input
                id={`${controlId}-native`}
                type="color"
                value={
                  valid && text.length === 7 ? text.toLowerCase() : "#000000"
                }
                onChange={(e) => handlePick(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-gray-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900"
              />
              <span className="ml-auto font-mono text-xs text-gray-600 dark:text-slate-300">
                {text || "—"}
              </span>
            </div>
          </div>
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

ColorInput.displayName = "ColorInput";

export default ColorInput;
