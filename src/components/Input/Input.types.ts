import React from "react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  loading?: boolean;
  required?: boolean;
  mask?: string;
  replacement?: { _: RegExp };
  maxLength?: number;
  maxValue?: number;
  minValue?: number;
  prefix?: string;
  prefixColor?: string;
  size?: InputSize;
}
