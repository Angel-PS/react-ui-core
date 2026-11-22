import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelBtn?: string;
  showBtn?: boolean;
  onClickBtn?: () => void;
  error?: string | null;
  /**
   * Helper text under the field. Wired to the control through
   * `aria-describedby`, so it is announced together with the label.
   */
  hint?: React.ReactNode;
  loading?: boolean;
  /** Regex map for the mask placeholder character (defaults to digits). */
  replacement?: { _: RegExp };
  /** Mask pattern, e.g. "(___) ___-____" (renders via @react-input/mask). */
  mask?: string;
  /** Optional color dot rendered next to the label. */
  color?: string;
  /** Select the whole value on focus. */
  selectAll?: boolean;
  required?: boolean;
  /** Truncates the typed value to this many characters. */
  maxLength?: number;
  /** Clamps the typed value down to this number while typing. */
  maxValue?: number;
  /**
   * Raises a value below this number up to it when the field loses focus. An
   * empty field is left empty (required-ness belongs to validation), and the
   * clamp waits for blur so a value can be typed through smaller numbers
   * ("1" on the way to "15" with a minimum of 10).
   */
  minValue?: number;
  formatDecimals?: number;
  /**
   * Strips every non-digit as it is typed — for identifiers made of digits
   * (a tax id, a document number) rendered as a text field so leading zeros
   * survive.
   */
  digitsOnly?: boolean;
}
