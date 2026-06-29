import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { filterDisplayValue, isFilterApplied } from "./helpers";
import { keysForFilter } from "./serialize";
import type { FilterController } from "./useFilterController";
import type { FilterDef, FiltersLabels } from "./types";

interface FilterPillsProps {
  /** The secondary filter definitions (the ones that can appear as pills). */
  defs: FilterDef[];
  controller: FilterController;
  labels: FiltersLabels;
}

/** Removable chips for each applied secondary filter, plus a Clear all. */
export const FilterPills: FC<FilterPillsProps> = ({
  defs,
  controller,
  labels,
}) => {
  const applied = defs.filter((d) => isFilterApplied(d, controller.values));
  if (applied.length === 0) return null;

  const clearOne = (def: FilterDef) => {
    if (def.kind === "dateRange") {
      controller.setMany({ [def.fromKey]: "", [def.toKey]: "" });
    } else {
      controller.setValue(def.key, "");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {applied.map((def) => {
        const text = filterDisplayValue(def, controller.values);
        return (
          <span
            key={keysForFilter(def).join("-")}
            className="bg-primary-blue-lightest text-primary-blue-dark ring-primary-blue-lighter inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
          >
            {def.label ? `${def.label}: ${text}` : text}
            <button
              type="button"
              onClick={() => clearOne(def)}
              aria-label={labels.remove(def.label ?? text)}
              className="text-primary-blue-dark/60 hover:text-primary-blue-dark -mr-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors hover:bg-primary-blue-lighter"
            >
              <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
            </button>
          </span>
        );
      })}
      <button
        type="button"
        onClick={() => controller.clear()}
        className="cursor-pointer rounded-lg bg-transparent px-2 py-1 text-xs font-medium text-gray-500 dark:text-slate-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200"
      >
        {labels.clearAll}
      </button>
    </div>
  );
};

export default FilterPills;
