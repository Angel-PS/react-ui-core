import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelBtn?: string;
  showBtn?: boolean;
  onClickBtn?: () => void;
  error?: string | null;
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
  maxLength?: number;
  maxValue?: number;
  minValue?: number;
  formatDecimals?: number;
}
