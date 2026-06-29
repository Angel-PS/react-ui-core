import { useEffect, useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSliders } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { useClickOutside } from "../../hooks";
import { cn } from "../../lib/utils";
import { FilterField } from "./FilterField";
import { isFilterApplied } from "./helpers";
import { keysForFilter } from "./serialize";
import type { FilterController } from "./useFilterController";
import type { FilterDef, FilterValues, FiltersLabels } from "./types";

interface FiltersPopoverProps {
  /** The secondary filter definitions shown inside the popover. */
  defs: FilterDef[];
  controller: FilterController;
  labels: FiltersLabels;
}

const seedFrom = (defs: FilterDef[], source: FilterValues): FilterValues => {
  const out: FilterValues = {};
  for (const def of defs)
    for (const k of keysForFilter(def)) out[k] = source[k] ?? "";
  return out;
};

/**
 * "Filters" trigger + popover. Changes are staged in a local draft (seeded from
 * the live values on open) and committed in one batch on Apply, so toggling
 * several filters triggers a single update. Clear all resets every filter
 * (including the inline segmented) via the controller.
 */
export const FiltersPopover: FC<FiltersPopoverProps> = ({
  defs,
  controller,
  labels,
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterValues>({});
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Seed the draft from the live values whenever the popover opens, and wire Escape.
  useEffect(() => {
    if (!open) return;
    setDraft(seedFrom(defs, controller.values));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // Intentionally only re-run on open/close so the draft stays isolated while editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const appliedCount = defs.filter((d) =>
    isFilterApplied(d, controller.values),
  ).length;

  const setDraftValue = (key: string, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    controller.setMany(draft);
    setOpen(false);
  };

  const handleClearAll = () => {
    controller.clear();
    setDraft(seedFrom(defs, {}));
  };

  // Shared panel body (fields + footer) — rendered by both the desktop dropdown
  // and the mobile centered modal so the markup lives in one place.
  const panel = (
    <>
      <div className="flex flex-col gap-3">
        {defs.map((def) => (
          <FilterField
            key={keysForFilter(def).join("-")}
            def={def}
            values={draft}
            setValue={setDraftValue}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-3">
        <button
          type="button"
          onClick={handleClearAll}
          className="cursor-pointer bg-transparent text-sm text-gray-500 dark:text-slate-400 duration-200 hover:text-gray-400 dark:hover:text-slate-500"
        >
          {labels.clearAll}
        </button>
        <Button
          type="button"
          variant="primary"
          onClick={handleApply}
          className="rounded-lg px-4 py-1.5 text-sm"
        >
          {labels.apply}
        </Button>
      </div>
    </>
  );

  return (
    <div ref={ref} className="relative shrink-0">
      <Button
        type="button"
        variant="classic"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faSliders} className="text-xs" />
        {labels.button}
        {appliedCount > 0 && (
          <span className="bg-primary-blue-default inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
            {appliedCount}
          </span>
        )}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn(
            "text-[9px] transition-transform",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <>
          {/* Desktop (≥ sm): anchored dropdown under the trigger. */}
          <div
            role="dialog"
            className="absolute top-[calc(100%+6px)] right-0 z-50 hidden w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl sm:block"
            style={{ animation: "bp-fadein 0.14s ease-out" }}
          >
            {panel}
          </div>

          {/* Mobile (< sm): centered modal with a dim backdrop. */}
          <div className="animate-fadeIn fixed inset-0 z-9999 flex items-center justify-center p-4 sm:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              className="animate-scaleIn relative z-10 w-full max-w-sm rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl"
            >
              {panel}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FiltersPopover;
