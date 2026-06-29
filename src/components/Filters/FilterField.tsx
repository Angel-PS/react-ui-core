import type { FC } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Select } from "../Select";
import { DebouncedInput } from "./DebouncedInput";
import type { FilterDef, FilterValues } from "./types";

interface FilterFieldProps {
  def: FilterDef;
  /** Value source — the live controller values, or a popover draft. */
  values: FilterValues;
  /** Commit a change — to the live controller, or to a popover draft. */
  setValue: (key: string, value: string) => void;
}

/**
 * Renders the right control for a single filter definition. Used both inline
 * (segmented) and inside the Filters popover (everything else, bound to a draft).
 */
export const FilterField: FC<FilterFieldProps> = ({ def, values, setValue }) => {
  switch (def.kind) {
    case "segmented": {
      const fallback = def.defaultValue ?? def.options[0]?.value ?? "";
      const current = values[def.key] ?? fallback;
      return (
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-gray-100 dark:bg-slate-800 p-1">
          {def.options.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              onClick={() =>
                setValue(def.key, opt.value === fallback ? "" : opt.value)
              }
              variant={
                current === opt.value ? "active-filter" : "inactive-filter"
              }
            >
              {opt.label}
            </Button>
          ))}
        </div>
      );
    }
    case "select":
      return (
        <Select
          label={def.label}
          options={def.options}
          placeholder={def.placeholder}
          loading={def.loading}
          value={values[def.key] ?? ""}
          onChange={(e) => setValue(def.key, e.target.value)}
        />
      );
    case "text":
      return (
        <DebouncedInput
          type="text"
          label={def.label}
          placeholder={def.placeholder}
          value={values[def.key] ?? ""}
          onCommit={(next) => setValue(def.key, next)}
        />
      );
    case "number":
      return (
        <DebouncedInput
          type="number"
          label={def.label}
          placeholder={def.placeholder}
          value={values[def.key] ?? ""}
          onCommit={(next) => setValue(def.key, next)}
          min={def.min}
          max={def.max}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          label={def.label}
          value={values[def.key] ?? ""}
          onChange={(e) => setValue(def.key, e.target.value)}
        />
      );
    case "dateRange":
      return (
        <div className="flex flex-wrap gap-2">
          <div className="min-w-36 flex-1">
            <Input
              type="date"
              label={def.fromLabel}
              value={values[def.fromKey] ?? ""}
              onChange={(e) => setValue(def.fromKey, e.target.value)}
            />
          </div>
          <div className="min-w-36 flex-1">
            <Input
              type="date"
              label={def.toLabel}
              value={values[def.toKey] ?? ""}
              onChange={(e) => setValue(def.toKey, e.target.value)}
            />
          </div>
        </div>
      );
  }
};

export default FilterField;
