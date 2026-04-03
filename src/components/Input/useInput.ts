import React from "react";
import type { InputProps, InputSize } from "./Input.types";

const SIZE_MAP: Record<InputSize, { height: string; text: string; px: string }> = {
  sm: { height: "h-8", text: "text-xs", px: "px-2" },
  md: { height: "h-10.75", text: "text-sm", px: "px-3" },
  lg: { height: "h-12", text: "text-base", px: "px-4" },
};

export const useInput = ({
  type,
  error,
  className,
  maxLength,
  maxValue,
  minValue,
  onInput,
  disabled,
  prefix,
  size = "md",
}: Pick<
  InputProps,
  | "type"
  | "error"
  | "className"
  | "maxLength"
  | "maxValue"
  | "minValue"
  | "onInput"
  | "disabled"
  | "prefix"
  | "size"
>) => {
  const { height, text, px } = SIZE_MAP[size ?? "md"];
  const hasPrefix = Boolean(prefix);

  const borderClass = [
    "border border-gray-300 rounded-[0.3125rem]",
    error ? "border-red-500" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const disabledClass = disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white";
  const transition = "transition-[border-color,box-shadow] duration-150";

  // Wrapper used when prefix is present — focus-within handles the ring
  const wrapperClass = [
    "flex items-center overflow-hidden w-full",
    height,
    borderClass,
    "focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
    transition,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Standalone input (no prefix)
  const inputClass = [
    "flex w-full outline-none text-gray-900",
    height,
    px,
    text,
    borderClass,
    "focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
    transition,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Input inside the wrapper — no border, no background
  const innerInputClass = [
    "flex-1 h-full border-0 outline-none bg-transparent text-gray-900",
    px,
    text,
    disabled ? "cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Prefix span
  const prefixClass = [
    "shrink-0 flex items-center self-stretch border-r border-gray-300 bg-gray-100 text-gray-400 select-none whitespace-nowrap",
    px,
    text,
  ].join(" ");

  // Skeleton height matches size
  const skeletonClass = `skeleton ${height}`;

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (type === "number" && e.currentTarget.value.startsWith("0")) {
      e.currentTarget.value = e.currentTarget.value.slice(1);
    }
    if (maxLength && e.currentTarget.value.length > maxLength) {
      e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
    }
    if (maxValue && Number(e.currentTarget.value) > maxValue) {
      e.currentTarget.value = maxValue.toString();
    }
    if (
      (minValue || minValue === 0) &&
      Number(e.currentTarget.value) < minValue
    ) {
      e.currentTarget.value = minValue.toString();
    }
    onInput?.(e);
  };

  return {
    hasPrefix,
    wrapperClass,
    inputClass,
    innerInputClass,
    prefixClass,
    skeletonClass,
    handleInput,
  };
};
