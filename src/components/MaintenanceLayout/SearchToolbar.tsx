import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import type { PageAction } from "../../types";

export type SearchBarConfig = {
  placeholder?: string;
  totalCount?: number;
};

export interface SearchToolbarLabels {
  searchPlaceholder: string;
  addNew: string;
  resultCount: (count: number) => string;
}

const DEFAULT_SEARCH_TOOLBAR_LABELS: SearchToolbarLabels = {
  searchPlaceholder: "Search…",
  addNew: "Add new",
  resultCount: (count) => `${count} results`,
};

type SearchToolbarProps = SearchBarConfig & {
  onCreateClick: () => void;
  canCreate: boolean;
  pageActions?: PageAction[];
  /** Optional column-manager control rendered in the right-hand action group. */
  columnManager?: ReactNode;
  /** Controlled search value (the library does not own the search term). */
  searchValue: string;
  onSearchChange: (value: string) => void;
  /**
   * Debounce `onSearchChange` by this many ms (e.g. 400) while the user types;
   * the input keeps its own value meanwhile. Clearing the search commits at
   * once. Omit or 0 to call `onSearchChange` on every keystroke.
   */
  searchDebounceMs?: number;
  labels?: Partial<SearchToolbarLabels>;
};

/**
 * The input's own value, committed to `onChange` only after `delayMs` of quiet.
 * An outside change to `value` (e.g. the consumer resetting the search) is
 * mirrored into the input, but never one we sent ourselves mid-typing.
 */
const useDebouncedSearch = (
  value: string,
  onChange: (value: string) => void,
  delayMs: number,
) => {
  const [input, setInput] = useState(value);
  const lastSent = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestOnChange = useRef(onChange);
  latestOnChange.current = onChange;

  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setInput(value);
    }
  }, [value]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const commit = (next: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    lastSent.current = next;
    latestOnChange.current(next);
  };

  const change = (next: string) => {
    setInput(next);
    if (delayMs <= 0) {
      commit(next);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), delayMs);
  };

  const clear = () => {
    setInput("");
    commit("");
  };

  return { input: delayMs > 0 ? input : value, change, clear };
};

export const PageActionButton: FC<{ action: PageAction }> = ({ action }) => (
  <Button
    type="button"
    variant={action.variant ?? "primary"}
    onClick={action.onClick}
    disabled={action.disabled || action.loading}
    className="flex items-center gap-2"
  >
    {action.icon && <FontAwesomeIcon icon={action.icon} className="text-xs" />}
    {action.label}
  </Button>
);

export const SearchToolbar: FC<SearchToolbarProps> = ({
  placeholder,
  totalCount,
  onCreateClick,
  canCreate,
  pageActions,
  columnManager,
  searchValue,
  onSearchChange,
  searchDebounceMs = 0,
  labels,
}) => {
  const l = { ...DEFAULT_SEARCH_TOOLBAR_LABELS, ...labels };
  const search = useDebouncedSearch(
    searchValue,
    onSearchChange,
    searchDebounceMs,
  );

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="focus-within:border-primary-blue-default focus-within:ring-primary-blue-light/50 flex max-w-sm min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-xs transition focus-within:ring-2">
        <FontAwesomeIcon
          icon={faSearch}
          className="shrink-0 text-xs text-gray-400 dark:text-slate-500"
        />
        <input
          value={search.input}
          onChange={(e) => search.change(e.target.value)}
          placeholder={placeholder ?? l.searchPlaceholder}
          className="h-auto flex-1 border-0 bg-transparent px-0 text-sm text-gray-700 dark:text-slate-300 outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
        {search.input && (
          <button
            type="button"
            onClick={search.clear}
            className="bg-transparent p-0 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {totalCount !== undefined && (
          <span className="hidden text-xs text-gray-400 dark:text-slate-500 sm:inline">
            {l.resultCount(totalCount)}
          </span>
        )}
        {columnManager}
        {pageActions?.map((action, idx) => (
          <PageActionButton key={`${action.label}-${idx}`} action={action} />
        ))}
        {canCreate && (
          <Button
            variant="primary"
            onClick={onCreateClick}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            {l.addNew}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;
