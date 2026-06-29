import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface CommandItem {
  id: string | number;
  label: string;
  icon?: IconDefinition;
  /** Optional trailing context label (e.g. the section/group it belongs to). */
  groupLabel?: string;
  /** Destination path passed to `onSelect`. */
  path: string;
}

export interface CommandSection {
  id: string | number;
  /** Section heading (already translated). */
  title: string;
  items: CommandItem[];
}

export interface CommandPaletteLabels {
  title: string;
  inputAria: string;
  inputPlaceholder: string;
  empty: string;
  hint: string;
}

export interface CommandPaletteProps {
  /** All available command sections. The palette filters them by the query. */
  sections: CommandSection[];
  /** Fired when an item is chosen (click or Enter). */
  onSelect: (item: CommandItem) => void;
  /** Fired on backdrop click, Escape, or after a selection. */
  onClose: () => void;
  labels?: Partial<CommandPaletteLabels>;
}
