import { Option } from "@/types";
import { LegacyRef } from "react";

export interface MultiSelectProps {
  label: string;
  name?: string;
  options: Option[];
  value?: (string | number)[];
  onChange?: (event: {
    target: { name?: string; value: (string | number)[] };
  }) => void;
  error?: string | null;
  loading?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  color?: string;
  maxSelectedDisplay?: number;
  required?: boolean;
}

export interface MultiSelectTriggerProps {
  triggerRef: LegacyRef<HTMLDivElement> | undefined;
  selectClass: string;
  isOpen: boolean;
  disabled: boolean;
  displayText: string | null;
  selectedOptions: Option[];
  onToggleOpen: () => void;
  onRemoveTag: (id: string | number, e: React.MouseEvent) => void;
}

export interface MultiSelectDropdownProps {
  portalRef: LegacyRef<HTMLDivElement> | undefined;
  searchTerm: string;
  filteredOptions: Option[];
  selectedIds: (string | number)[];
  onSearchChange: (term: string) => void;
  onToggleOption: (id: string | number) => void;
}
