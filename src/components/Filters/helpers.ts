import type { FilterDef, FilterValues } from "./types";

/** The value a filter holds when it is "not applied" (cleared). */
const clearedValue = (def: FilterDef): string => {
  if (def.kind === "segmented") {
    return def.defaultValue ?? def.options[0]?.value ?? "";
  }
  if (def.kind === "dateRange") return "";
  return def.defaultValue ?? "";
};

/** Whether a filter currently has a meaningful (non-default, non-empty) value. */
export const isFilterApplied = (
  def: FilterDef,
  values: FilterValues,
): boolean => {
  if (def.kind === "dateRange") {
    return Boolean(values[def.fromKey]) || Boolean(values[def.toKey]);
  }
  const value = values[def.key] ?? "";
  return value !== "" && value !== clearedValue(def);
};

/** Human-readable value used for the active-filter pill label. */
export const filterDisplayValue = (
  def: FilterDef,
  values: FilterValues,
): string => {
  switch (def.kind) {
    case "select":
      return (
        def.options.find((o) => String(o.value) === (values[def.key] ?? ""))
          ?.label ??
        values[def.key] ??
        ""
      );
    case "dateRange":
      return [values[def.fromKey] ?? "", values[def.toKey] ?? ""]
        .filter(Boolean)
        .join(" – ");
    default:
      return values[def.key] ?? "";
  }
};
