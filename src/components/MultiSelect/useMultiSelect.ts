import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import type { MultiSelectProps } from "./MultiSelect.types";
import { Option } from "@/types";

export const useMultiSelect = ({
  options = [],
  value = [],
  name,
  onChange,
  disabled = false,
  error = null,
  className = "",
}: Pick<
  MultiSelectProps,
  "options" | "value" | "name" | "onChange" | "disabled" | "error" | "className"
>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [localOptions, setLocalOptions] = useState<Option[]>(options);

  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef<(string | number)[]>([]);

  const selectClass = [
    "flex items-center justify-between w-full min-h-[2.6875rem] border border-gray-300 rounded-[5px] bg-white cursor-pointer outline-none transition-[border-color,box-shadow] duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]",
    error ? "border-red-500" : "",
    disabled ? "bg-gray-100 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const emitChange = (newIds: (string | number)[]) => {
    setSelectedIds(newIds);
    onChange?.({ target: { name, value: newIds } });
  };

  const handleToggleOption = (optionId: string | number) => {
    if (disabled) return;
    const newIds = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];
    emitChange(newIds);
  };

  const handleRemoveTag = (optionId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    emitChange(selectedIds.filter((id) => id !== optionId));
  };

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedIds.includes(option.value)),
    [options, selectedIds],
  );

  const filteredOptions = useMemo(
    () =>
      localOptions.filter((option) =>
        String(option.label).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [localOptions, searchTerm],
  );

  // Close when clicking outside both the component and the portal
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        portalRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // Position portal directly via DOM to avoid re-renders on scroll/resize
  useLayoutEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current || !portalRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      portalRef.current.style.top = `${rect.bottom + 4}px`;
      portalRef.current.style.left = `${rect.left}px`;
      portalRef.current.style.width = `${rect.width}px`;
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Sync external value prop into selectedIds
  useEffect(() => {
    if (!Array.isArray(value)) return;
    const prev = prevValueRef.current;
    const valueStr = JSON.stringify([...value].sort());
    const prevStr = JSON.stringify([...prev].sort());
    if (valueStr !== prevStr) {
      setSelectedIds(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Keep selected options at the top of the list
  useEffect(() => {
    const sortSelectedFirst = (a: Option, b: Option) => {
      const aIndex = selectedIds.indexOf(a.value);
      const bIndex = selectedIds.indexOf(b.value);
      return bIndex - aIndex;
    };
    setLocalOptions([...options].sort(sortSelectedFirst));
  }, [options, selectedIds]);

  return {
    isOpen,
    selectedIds,
    searchTerm,
    selectedOptions,
    filteredOptions,
    selectClass,
    containerRef,
    triggerRef,
    portalRef,
    setIsOpen,
    setSearchTerm,
    handleToggleOption,
    handleRemoveTag,
  };
};
