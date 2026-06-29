import { useState } from "react";
import { keysForFilter, readFilterValues } from "./serialize";
import type { FilterDef, FilterValues } from "./types";

export interface FilterController {
  /** The definitions this controller manages (passed straight to MaintenanceFilters). */
  filters: FilterDef[];
  /** Current value of every filter (keyed by `key` / `fromKey`/`toKey`). */
  values: FilterValues;
  setValue: (key: string, value: string) => void;
  setMany: (patch: Record<string, string | undefined>) => void;
  clear: (keys?: string[]) => void;
}

/**
 * Router-free filter controller — keeps every filter value in local React state.
 * Pass the result to {@link MaintenanceFilters} (or read `values` yourself).
 *
 * The library deliberately does NOT sync to the URL: that's an app concern.
 * If you want URL-backed filters, implement the same {@link FilterController}
 * interface in your app (e.g. on top of your router's search params) and pass
 * that instead. Use `opts.onChange` to react to every committed change (e.g. to
 * refetch a list or mirror the values into your own URL state).
 */
export const useFilterController = (
  filters: FilterDef[],
  opts?: { onChange?: (values: FilterValues) => void },
): FilterController => {
  const defaults = readFilterValues(filters, new URLSearchParams());
  const [values, setValues] = useState<FilterValues>(defaults);

  const commit = (next: FilterValues) => {
    setValues(next);
    opts?.onChange?.(next);
  };

  const setMany = (patch: Record<string, string | undefined>) => {
    const next = { ...values };
    for (const [k, v] of Object.entries(patch)) {
      next[k] = v === undefined || v === "" ? (defaults[k] ?? "") : v;
    }
    commit(next);
  };

  const setValue = (key: string, value: string) => setMany({ [key]: value });

  const clear = (keys?: string[]) => {
    const targets = keys ?? filters.flatMap(keysForFilter);
    const next = { ...values };
    for (const k of targets) next[k] = defaults[k] ?? "";
    commit(next);
  };

  return { filters, values, setValue, setMany, clear };
};
