import type { FC, ReactNode } from "react";
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
  labels?: Partial<SearchToolbarLabels>;
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
  labels,
}) => {
  const l = { ...DEFAULT_SEARCH_TOOLBAR_LABELS, ...labels };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="focus-within:border-primary-blue-default focus-within:ring-primary-blue-light/50 flex max-w-sm min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-xs transition focus-within:ring-2">
        <FontAwesomeIcon
          icon={faSearch}
          className="shrink-0 text-xs text-gray-400 dark:text-slate-500"
        />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder ?? l.searchPlaceholder}
          className="h-auto flex-1 border-0 bg-transparent px-0 text-sm text-gray-700 dark:text-slate-300 outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange("")}
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
