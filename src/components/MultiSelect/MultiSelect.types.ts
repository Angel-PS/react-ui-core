import { Option } from "@/types";
import { LegacyRef } from "react";

/** Every user-facing string MultiSelect renders. English by default. */
export interface MultiSelectLabels {
  /** Shown when nothing is selected and no `placeholder` prop is passed. */
  placeholder: string;
  /** Placeholder of the search box inside the dropdown. */
  search: string;
  /** Empty dropdown (no options at all). */
  noOptions: string;
  /** Empty dropdown after filtering by the search term. */
  noResults: string;
  /** Summary shown instead of chips once more than `maxSelectedDisplay` are picked. */
  selectedCount: (count: number) => string;
  /** Accessible name of a chip's remove (x) button. */
  removeItem: (label: string) => string;
}

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
  /** Override any of the English default strings. */
  labels?: Partial<MultiSelectLabels>;
}

export interface MultiSelectTriggerProps {
  triggerRef: LegacyRef<HTMLDivElement> | undefined;
  /** Id of the visible label, for `aria-labelledby`. */
  labelId?: string;
  /** Id of the error message, for `aria-describedby`. */
  errorId?: string;
  invalid?: boolean;
  removeItemLabel: (label: string) => string;
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
  labels: Pick<MultiSelectLabels, "search" | "noOptions" | "noResults">;
  searchTerm: string;
  filteredOptions: Option[];
  selectedIds: (string | number)[];
  onSearchChange: (term: string) => void;
  onToggleOption: (id: string | number) => void;
}
