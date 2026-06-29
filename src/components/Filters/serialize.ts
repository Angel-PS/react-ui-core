import type { FilterDef, FilterValues } from "./types";

/** Keys reset (deleted) whenever a filter changes, so pagination returns to page 1. */
export const FILTER_RESET_KEYS = ["page"];

/** Every key owned by a filter definition. */
export const keysForFilter = (def: FilterDef): string[] => {
  if (def.kind === "dateRange") return [def.fromKey, def.toKey];
  return [def.key];
};

/**
 * Read each filter's value from a params source, applying default fallbacks.
 * Works for both a URL `searchParams` and a fresh `URLSearchParams()` (which
 * yields the defaults — used to seed local filter state).
 */
export const readFilterValues = (
  filters: FilterDef[],
  params: URLSearchParams,
): FilterValues => {
  const out: FilterValues = {};
  for (const def of filters) {
    switch (def.kind) {
      case "segmented": {
        out[def.key] =
          params.get(def.key) ??
          def.defaultValue ??
          def.options[0]?.value ??
          "";
        break;
      }
      case "dateRange": {
        out[def.fromKey] =
          params.get(def.fromKey) ?? def.defaultValue?.from ?? "";
        out[def.toKey] = params.get(def.toKey) ?? def.defaultValue?.to ?? "";
        break;
      }
      case "select":
      case "text":
      case "number":
      case "date": {
        out[def.key] = params.get(def.key) ?? def.defaultValue ?? "";
        break;
      }
    }
  }
  return out;
};

const isEmpty = (value: string | null | undefined): boolean =>
  value === undefined || value === null || value === "";

const applyEntry = (
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) => {
  if (isEmpty(value)) {
    params.delete(key);
  } else {
    params.set(key, value as string);
  }
};

/**
 * Apply a patch of filter values onto a copy of `params`. Empty values delete
 * their key; non-empty values set it. By default `page` is reset (deleted) so
 * the list returns to page 1.
 */
export const writeFilterPatch = (
  params: URLSearchParams,
  patch: Record<string, string | undefined>,
  options: { resetPage?: boolean } = { resetPage: true },
): URLSearchParams => {
  const next = new URLSearchParams(params);
  for (const [k, v] of Object.entries(patch)) {
    applyEntry(next, k, v);
  }
  if (options.resetPage !== false) {
    for (const k of FILTER_RESET_KEYS) next.delete(k);
  }
  return next;
};
