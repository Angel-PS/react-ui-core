import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface HeaderColumn {
  value: string | number;
  accessor: string;
  justify?: "left" | "center" | "right";
  /**
   * Backend column for server-side sorting (`?sort=key` asc, `?sort=-key` desc).
   * Presence makes the column sortable. Must be a scalar column on the model —
   * relation/dot-notation fields are not supported by top-level sort.
   */
  sortKey?: string;
  /**
   * Pinned column — always visible, cannot be hidden or reordered in the column
   * manager. Use for identity/total columns a list is meaningless without.
   */
  locked?: boolean;
}

export interface Column {
  value: string | number;
  accessor: string;
  justify?: "left" | "center" | "right";
  status?: string;
  dataType?:
    | "string"
    | "number"
    | "date"
    | "datetime"
    | "color"
    | "link"
    | "decimal"
    | "status"
    | "avatar";
  subValue?: string | number;
}

export interface ExpandField {
  label: string;
  accessor: string;
  dataType?: Column["dataType"];
  justify?: "left" | "center" | "right";
}

/**
 * Per-table column layout a user customizes (visibility + order). `order` and
 * `hidden` reference {@link HeaderColumn.accessor} — stable, untranslated
 * identifiers — so preferences survive language switches. The library leaves
 * persistence to the consumer (pass it in via `columnPref`, persist it in
 * `onColumnChange`).
 */
export interface TableColumnPref {
  /** Accessors in the user's preferred display order. */
  order: string[];
  /** Accessors the user has turned off. */
  hidden: string[];
}

export interface RowColumn {
  id: string | number;
  columns: Column[];
  showActions?: boolean;
  /**
   * Per-row override to hide ONLY the delete action while keeping edit/view.
   * Defaults to visible; set `false` to suppress delete.
   */
  canDelete?: boolean;
  color?: string;
  expandData?: Record<string, string | number | ReactNode | null>;
}

export interface TableAction {
  label: string;
  icon: ReactNode;
  onClick: (id: string | number) => void;
  hidden?: (row: RowColumn) => boolean;
  variant?: "default" | "danger";
  disabled?: (id: string | number) => boolean;
}

export interface PageAction {
  label: string;
  onClick: () => void;
  icon?: IconDefinition;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "classic" | "cancel";
}
