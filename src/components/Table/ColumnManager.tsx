import {
  useEffect,
  useId,
  useState,
  type FC,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCircleInfo,
  faGripVertical,
  faLock,
  faMagnifyingGlass,
  faRotateLeft,
  faTableColumns,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { InputCheckbox } from "../InputToggle";
import { useClickOutside } from "../../hooks";
import { cn } from "../../lib/utils";
import type { HeaderColumn, TableColumnPref } from "../../types";

export interface ColumnManagerLabels {
  button: string;
  title: string;
  visibleSummary: (shown: number, total: number) => string;
  selectAll: string;
  selectNone: string;
  searchPlaceholder: string;
  clearSearch: string;
  listLabel: string;
  noMatch: string;
  reorder: (name: string) => string;
  reordered: (info: { name: string; position: number; total: number }) => string;
  locked: string;
  hide: (name: string) => string;
  show: (name: string) => string;
  minOneHint: string;
  restoreDefaults: string;
  done: string;
}

const DEFAULT_COLUMN_MANAGER_LABELS: ColumnManagerLabels = {
  button: "Columns",
  title: "Manage columns",
  visibleSummary: (shown, total) => `${shown} of ${total} columns shown`,
  selectAll: "All",
  selectNone: "None",
  searchPlaceholder: "Search columns…",
  clearSearch: "Clear search",
  listLabel: "Columns",
  noMatch: "No columns match your search",
  reorder: (name) => `Reorder ${name}`,
  reordered: ({ name, position, total }) =>
    `${name} moved to position ${position} of ${total}`,
  locked: "Pinned column",
  hide: (name) => `Hide ${name}`,
  show: (name) => `Show ${name}`,
  minOneHint: "At least one column must stay visible",
  restoreDefaults: "Restore defaults",
  done: "Done",
};

interface ColumnManagerProps {
  /** Full (already translated) column catalog, in the table's natural order. */
  columns: HeaderColumn[];
  /** The user's committed preference for this table, if any. */
  pref?: TableColumnPref;
  /** Commit a new layout. The panel closes itself after calling this. */
  onApply: (next: TableColumnPref) => void;
  labels?: Partial<ColumnManagerLabels>;
}

/**
 * Compute the full ordered list of accessors to display in the manager (visible
 * AND hidden), reconciling a saved pref against the live catalog: saved order
 * first (dropping accessors no longer in the catalog), then any new catalog
 * columns appended in catalog order.
 */
const seedOrder = (
  columns: HeaderColumn[],
  pref?: TableColumnPref,
): string[] => {
  const catalogAccessors = new Set(columns.map((c) => c.accessor));
  const seen = new Set<string>();
  const order: string[] = [];
  for (const accessor of pref?.order ?? []) {
    if (catalogAccessors.has(accessor) && !seen.has(accessor)) {
      order.push(accessor);
      seen.add(accessor);
    }
  }
  for (const col of columns) {
    if (!seen.has(col.accessor)) order.push(col.accessor);
  }
  return order;
};

type Draft = { order: string[]; hidden: string[] };

const seedDraft = (columns: HeaderColumn[], pref?: TableColumnPref): Draft => {
  const order = seedOrder(columns, pref);
  const byAccessor = new Map(columns.map((c) => [c.accessor, c]));
  // A locked (pinned) column is always visible — never carry it as hidden.
  const hidden = (pref?.hidden ?? []).filter(
    (a) => byAccessor.has(a) && !byAccessor.get(a)?.locked,
  );
  return { order, hidden };
};

export const ColumnManager: FC<ColumnManagerProps> = ({
  columns,
  pref,
  onApply,
  labels,
}) => {
  const l: ColumnManagerLabels = { ...DEFAULT_COLUMN_MANAGER_LABELS, ...labels };
  const idBase = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => seedDraft(columns, pref));
  const [search, setSearch] = useState("");
  const [liveMessage, setLiveMessage] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Seed the draft from the committed pref each time the panel opens, clear any
  // stale search, and wire Escape so editing stays isolated until "Done".
  useEffect(() => {
    if (!open) return;
    setDraft(seedDraft(columns, pref));
    setSearch("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // Intentionally only re-run on open/close so the draft stays isolated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const byAccessor = new Map(columns.map((c) => [c.accessor, c]));
  const hiddenSet = new Set(draft.hidden);
  const lockedSet = new Set(
    columns.filter((c) => c.locked).map((c) => c.accessor),
  );
  const anyLocked = lockedSet.size > 0;

  const orderedRows = draft.order
    .map((accessor) => byAccessor.get(accessor))
    .filter((c): c is HeaderColumn => !!c);
  const visibleCount = orderedRows.filter(
    (c) => !hiddenSet.has(c.accessor),
  ).length;

  const query = search.trim().toLowerCase();
  const isFiltering = query.length > 0;
  const displayRows = isFiltering
    ? orderedRows.filter((c) => String(c.value).toLowerCase().includes(query))
    : orderedRows;

  const committedHiddenCount = (pref?.hidden ?? []).filter(
    (a) => byAccessor.has(a) && !byAccessor.get(a)?.locked,
  ).length;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.order.length || from === to) return;
    // Pinned rows hold their place: neither the dragged row nor the target slot
    // may be a locked column.
    if (lockedSet.has(draft.order[from]) || lockedSet.has(draft.order[to])) {
      return;
    }
    const order = [...draft.order];
    const [moved] = order.splice(from, 1);
    order.splice(to, 0, moved);
    setDraft((d) => ({ ...d, order }));
    const label = byAccessor.get(moved)?.value ?? moved;
    setLiveMessage(
      l.reordered({
        name: String(label),
        position: to + 1,
        total: order.length,
      }),
    );
  };

  const toggle = (accessor: string) => {
    if (lockedSet.has(accessor)) return; // pinned columns can't be hidden
    const isVisible = !hiddenSet.has(accessor);
    // Never let the user hide the last visible column.
    if (isVisible && visibleCount <= 1) return;
    setDraft((d) => ({
      ...d,
      hidden: isVisible
        ? [...d.hidden, accessor]
        : d.hidden.filter((a) => a !== accessor),
    }));
  };

  const handleSelectAll = () => setDraft((d) => ({ ...d, hidden: [] }));

  const handleSelectNone = () =>
    setDraft((d) => ({
      ...d,
      // Hide everything that isn't pinned. With no locked columns, keep the
      // first column visible so the table never goes headerless.
      hidden: d.order.filter(
        (a, i) => !lockedSet.has(a) && (anyLocked || i !== 0),
      ),
    }));

  const handleRestoreDefaults = () => {
    setDraft({ order: columns.map((c) => c.accessor), hidden: [] });
    setSearch("");
  };

  const handleApply = () => {
    onApply({ order: draft.order, hidden: draft.hidden });
    setOpen(false);
  };

  const handleDrop = (index: number) => {
    if (dragIndex !== null) move(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleGripKey =
    (index: number) => (e: ReactKeyboardEvent<HTMLSpanElement>) => {
      if (isFiltering) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        move(index, index - 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        move(index, index + 1);
      }
    };

  if (columns.length < 2) return null;

  const panel = (
    <div className="flex flex-col">
      {/* Header: title + visible summary + quick select */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-slate-100">
            {l.title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">
            {l.visibleSummary(visibleCount, orderedRows.length)}
          </p>
        </div>
        <div className="inline-flex shrink-0 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-slate-800">
          <Button
            type="button"
            variant="inactive-filter"
            onClick={handleSelectAll}
            className="px-2.5 py-1 text-xs"
          >
            {l.selectAll}
          </Button>
          <Button
            type="button"
            variant="inactive-filter"
            onClick={handleSelectNone}
            className="px-2.5 py-1 text-xs"
          >
            {l.selectNone}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={l.searchPlaceholder}
            autoComplete="off"
            className="focus:border-primary-blue-default focus:ring-primary-blue-light/50 h-9 w-full rounded-lg border border-gray-200 bg-white pr-9 pl-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={l.clearSearch}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 bg-transparent p-1 text-xs text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>

      {/* Column list */}
      <ul
        className="max-h-76 space-y-0.5 overflow-y-auto px-3 pb-1"
        aria-label={l.listLabel}
      >
        {displayRows.length === 0 ? (
          <li className="px-3 py-7 text-center text-sm text-gray-400 dark:text-slate-500">
            {l.noMatch}
          </li>
        ) : (
          displayRows.map((col) => {
            const index = draft.order.indexOf(col.accessor);
            const isVisible = !hiddenSet.has(col.accessor);
            const locked = !!col.locked;
            const lastVisible = isVisible && !locked && visibleCount <= 1;
            const cbId = `${idBase}-${col.accessor}`;
            const draggable = !locked && !isFiltering;
            return (
              <li
                key={col.accessor}
                draggable={draggable}
                onDragStart={() => draggable && setDragIndex(index)}
                onDragOver={(e) => {
                  if (!draggable) return;
                  e.preventDefault();
                  if (!locked) setDragOverIndex(index);
                }}
                onDrop={() => draggable && handleDrop(index)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors",
                  !locked && "hover:bg-gray-50 dark:hover:bg-slate-800",
                  dragIndex === index && "opacity-40",
                  dragOverIndex === index &&
                    dragIndex !== index &&
                    "bg-primary-blue-lightest dark:bg-slate-800",
                )}
              >
                {locked ? (
                  <span className="w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <span
                    role="button"
                    tabIndex={isFiltering ? -1 : 0}
                    aria-label={l.reorder(String(col.value))}
                    onKeyDown={handleGripKey(index)}
                    className="focus-visible:ring-primary-blue-light hover:text-primary-blue-default flex w-4 shrink-0 cursor-grab items-center justify-center rounded text-gray-300 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing dark:text-slate-600"
                  >
                    <FontAwesomeIcon
                      icon={faGripVertical}
                      className="text-[13px]"
                    />
                  </span>
                )}

                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    locked
                      ? "font-medium text-gray-900 dark:text-slate-100"
                      : isVisible
                        ? "text-gray-700 dark:text-slate-200"
                        : "text-gray-400 dark:text-slate-500",
                  )}
                >
                  {col.value}
                </span>

                {locked && (
                  <FontAwesomeIcon
                    icon={faLock}
                    title={l.locked}
                    aria-label={l.locked}
                    className="shrink-0 text-[11px] text-gray-400 dark:text-slate-500"
                  />
                )}

                <div className="flex shrink-0 items-center">
                  <InputCheckbox
                    id={cbId}
                    checked={isVisible}
                    disabled={locked || lastVisible}
                    onChange={() => toggle(col.accessor)}
                    aria-label={
                      isVisible
                        ? l.hide(String(col.value))
                        : l.show(String(col.value))
                    }
                  />
                </div>
              </li>
            );
          })
        )}
      </ul>

      {!anyLocked && visibleCount <= 1 && (
        <p className="flex items-center gap-1.5 px-5 pb-2 text-xs text-gray-400 dark:text-slate-500">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[10px]" />
          {l.minOneHint}
        </p>
      )}

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
        <button
          type="button"
          onClick={handleRestoreDefaults}
          className="hover:text-primary-blue-default dark:hover:text-primary-blue-default inline-flex cursor-pointer items-center gap-2 bg-transparent text-sm text-gray-500 transition-colors duration-200 dark:text-slate-400"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="text-[11px]" />
          {l.restoreDefaults}
        </button>
        <Button
          type="button"
          variant="primary"
          onClick={handleApply}
          className="rounded-lg px-5 py-1.5 text-sm"
        >
          {l.done}
        </Button>
      </div>

      <span aria-live="polite" className="sr-only">
        {liveMessage}
      </span>
    </div>
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
        <FontAwesomeIcon icon={faTableColumns} className="text-xs" />
        {l.button}
        {committedHiddenCount > 0 && (
          <span className="bg-primary-blue-default inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
            {committedHiddenCount}
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
            aria-label={l.title}
            className="absolute top-[calc(100%+6px)] right-0 z-50 hidden w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:block dark:border-slate-800 dark:bg-slate-900"
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
              aria-label={l.title}
              className="animate-scaleIn relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              {panel}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColumnManager;
