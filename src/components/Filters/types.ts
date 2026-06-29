import type { Option } from "../../types";

/**
 * Shared fields for every filter definition.
 *
 * `key` is the URL/state key the value is read from / written to.
 * `label` / option labels must be PRE-TRANSLATED by the consumer — the filter
 * components never localize text themselves.
 * `inUrl` is accepted for parity with URL-backed controllers; the bundled
 * {@link useFilterController} keeps all values in local state.
 */
export interface BaseFilter {
  kind: string;
  /** Query-param / state key. */
  key: string;
  /** Pre-translated field label. Optional for `segmented`. */
  label?: string;
  /** Tailwind width override for the field wrapper. */
  widthClass?: string;
  /** Persist this filter in the URL query params (default `true`, controller-dependent). */
  inUrl?: boolean;
  /**
   * Where the control renders. Defaults by kind: `segmented` → `"inline"`
   * (always visible), everything else → `"popover"` (inside the Filters panel).
   */
  placement?: "inline" | "popover";
}

/** Status chips / button group. */
export interface SegmentedFilter extends BaseFilter {
  kind: "segmented";
  /** Pre-translated options. `value` is what lands in the filter state. */
  options: { value: string; label: string }[];
  /** Value treated as "no filter" — clears the param. Defaults to options[0].value. */
  defaultValue?: string;
}

/** Dropdown select (company, branch, ...). */
export interface SelectFilter extends BaseFilter {
  kind: "select";
  /** Pre-translated options, ready for the shared <Select>. Include a `{ value: "", label }` option for "All". */
  options: Option[];
  /** Optional pre-translated placeholder (a disabled hint option). */
  placeholder?: string;
  /** Forwarded to <Select loading> for async option sources. */
  loading?: boolean;
  defaultValue?: string;
}

/** Debounced free-text filter. */
export interface TextFilter extends BaseFilter {
  kind: "text";
  placeholder?: string;
  defaultValue?: string;
}

/** Debounced numeric filter. */
export interface NumberFilter extends BaseFilter {
  kind: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: string;
}

/** Single date picker. */
export interface DateFilter extends BaseFilter {
  kind: "date";
  defaultValue?: string;
}

/** From/to date range. The parent's `inUrl` governs both `fromKey` and `toKey`. */
export interface DateRangeFilter extends BaseFilter {
  kind: "dateRange";
  fromKey: string;
  toKey: string;
  /** Pre-translated sub-labels for the two inputs. */
  fromLabel: string;
  toLabel: string;
  defaultValue?: { from: string; to: string };
}

export type FilterDef =
  | SegmentedFilter
  | SelectFilter
  | TextFilter
  | NumberFilter
  | DateFilter
  | DateRangeFilter;

export type FilterValues = Record<string, string>;

/** Text overrides for the filter bar (pre-translated by the consumer). */
export interface FiltersLabels {
  button: string;
  apply: string;
  clearAll: string;
  remove: (name: string) => string;
}

export const DEFAULT_FILTERS_LABELS: FiltersLabels = {
  button: "Filters",
  apply: "Apply",
  clearAll: "Clear all",
  remove: (name) => `Remove ${name}`,
};
