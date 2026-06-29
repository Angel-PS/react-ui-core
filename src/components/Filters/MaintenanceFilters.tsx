import type { FC } from "react";
import { cn } from "../../lib/utils";
import { FilterField } from "./FilterField";
import { FiltersPopover } from "./FiltersPopover";
import { FilterPills } from "./FilterPills";
import { keysForFilter } from "./serialize";
import type { FilterController } from "./useFilterController";
import {
  DEFAULT_FILTERS_LABELS,
  type FilterDef,
  type FiltersLabels,
} from "./types";

/** Segmented filters default to inline; everything else defaults to the popover. */
const isInline = (def: FilterDef): boolean =>
  (def.placement ?? (def.kind === "segmented" ? "inline" : "popover")) ===
  "inline";

interface MaintenanceFiltersProps {
  /** The live controller (from `useFilterController` or your own implementation). */
  controller: FilterController;
  className?: string;
  /** Override the bar's text (Filters / Apply / Clear all / Remove). English by default. */
  labels?: Partial<FiltersLabels>;
}

/**
 * Responsive filter bar: primary filters (segmented) stay visible inline; the
 * rest live behind a "Filters" popover (staged, with a count badge) and surface
 * as removable pills once applied. Fully controlled — the consumer owns the
 * controller and passes it in.
 */
export const MaintenanceFilters: FC<MaintenanceFiltersProps> = ({
  controller,
  className,
  labels,
}) => {
  const { filters, values, setValue } = controller;
  if (filters.length === 0) return null;

  const mergedLabels: FiltersLabels = { ...DEFAULT_FILTERS_LABELS, ...labels };
  const inlineDefs = filters.filter(isInline);
  const popoverDefs = filters.filter((d) => !isInline(d));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {inlineDefs.map((def) => {
          const field = (
            <FilterField def={def} values={values} setValue={setValue} />
          );
          return def.kind === "segmented" ? (
            <div key={keysForFilter(def).join("-")}>{field}</div>
          ) : (
            <div
              key={keysForFilter(def).join("-")}
              className={def.widthClass ?? "w-48"}
            >
              {field}
            </div>
          );
        })}
        {popoverDefs.length > 0 && (
          <FiltersPopover
            defs={popoverDefs}
            controller={controller}
            labels={mergedLabels}
          />
        )}
      </div>
      {popoverDefs.length > 0 && (
        <FilterPills
          defs={popoverDefs}
          controller={controller}
          labels={mergedLabels}
        />
      )}
    </div>
  );
};

export default MaintenanceFilters;
