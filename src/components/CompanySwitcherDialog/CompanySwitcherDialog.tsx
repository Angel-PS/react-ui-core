import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, UIEvent } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useDialogA11y } from "../../hooks/useDialogA11y";
import { getInitials } from "../../lib/format";
import { normalize } from "../../lib/normalize";
import { cn } from "../../lib/utils";
import type { CompanyOption } from "../Sidebar/Sidebar.types";

export interface CompanySwitcherDialogLabels {
  /** Accessible name of the dialog and of the results list. */
  title: string;
  placeholder: string;
  /** aria-label of the search field. */
  inputAria: string;
  recent: string;
  allCompanies: string;
  searching: string;
  /** Footer + live-region count, e.g. "24 companies". */
  resultCount: (count: number) => string;
  /** Empty state headline for a query with no matches. */
  empty: (query: string) => string;
  emptyHint: string;
  loadingMore: string;
  /** Footer keyboard hint. */
  hint: string;
  /** Primary line of the "work without a company" row. */
  noCompanyOption: string;
  /** Secondary line of the "work without a company" row. */
  platformOnly: string;
  /** Text of the Escape key cap next to the search field. */
  escKey: string;
}

export const DEFAULT_COMPANY_SWITCHER_DIALOG_LABELS: CompanySwitcherDialogLabels =
  {
    title: "Switch company",
    placeholder: "Search by name, trade name or RNC…",
    inputAria: "Search company",
    recent: "Recent",
    allCompanies: "All companies",
    searching: "Searching…",
    resultCount: (count) => (count === 1 ? "1 company" : `${count} companies`),
    empty: (query) =>
      query ? `No companies match “${query}”` : "No companies available",
    emptyHint: "Check the trade name, or try the RNC.",
    loadingMore: "Loading more companies…",
    hint: "↑↓ to navigate · ↵ to select · esc to close",
    noCompanyOption: "No company",
    platformOnly: "Platform only",
    escKey: "esc",
  };

export interface CompanySwitcherDialogProps {
  /** Mounts the dialog. Each open starts with a fresh, empty query. */
  open: boolean;
  onClose: () => void;
  /**
   * The companies to list. In client-side mode (no `onQueryChange`) this is the
   * full list and the dialog filters it; in server mode it is the page(s)
   * already fetched for the current `query`.
   */
  companies: CompanyOption[];
  /** Shown above "All companies" while the query is empty. Live copies win. */
  recentCompanies?: CompanyOption[];
  /** The current company (gets the check mark). `null` = working without one. */
  activeCompanyId?: CompanyOption["id"] | null;
  onSelect: (company: CompanyOption) => void;
  /** When given, a "No company / Platform only" row is offered first. */
  onDeselect?: () => void;
  /** Controlled query (server mode). Ignored unless `onQueryChange` is set. */
  query?: string;
  /** Server mode: report the query and pass the matching `companies` back. */
  onQueryChange?: (query: string) => void;
  /** Total matches, including pages not loaded yet. Defaults to the rows shown. */
  matchCount?: number;
  /** First load: skeleton rows instead of results. */
  isLoading?: boolean;
  /** A server search is in flight: announced, and shown in the footer. */
  isSearching?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /** Requested when the list is scrolled (or arrowed) to its end. */
  onLoadMore?: () => void;
  labels?: Partial<CompanySwitcherDialogLabels>;
}

/** Distance from the bottom at which the next page is requested. */
const SCROLL_END_THRESHOLD_PX = 48;

/** Rows the arrow keys walk through, in render order. */
type Row =
  | { kind: "deselect" }
  | { kind: "company"; company: CompanyOption; section: "recent" | "all" };

/** Client-side match: accent- and case-insensitive over both label lines. */
export const matchesCompany = (company: CompanyOption, query: string) => {
  const needle = normalize(query.trim());
  if (!needle) return true;
  return normalize(
    `${company.primaryLabel} ${company.secondaryLabel ?? ""}`,
  ).includes(needle);
};

/**
 * A searchable company picker in a command-palette dialog: Recent + All
 * sections, keyboard navigation, optional "no company" row and incremental
 * loading. Data-free — the consumer supplies companies, recents and paging.
 *
 * Portalled to `document.body` on purpose: the usual trigger lives inside a
 * transformed sidebar, and a transform makes an element the containing block
 * for `position: fixed` descendants.
 */
export const CompanySwitcherDialog = (props: CompanySwitcherDialogProps) => {
  if (!props.open) return null;
  return <CompanySwitcherDialogPanel {...props} />;
};

const CompanySwitcherDialogPanel = ({
  onClose,
  companies,
  recentCompanies = [],
  activeCompanyId = null,
  onSelect,
  onDeselect,
  query: controlledQuery,
  onQueryChange,
  matchCount,
  isLoading = false,
  isSearching = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  labels,
}: CompanySwitcherDialogProps) => {
  const copy = { ...DEFAULT_COMPANY_SWITCHER_DIALOG_LABELS, ...labels };
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const dialogId = useId();

  const serverMode = Boolean(onQueryChange);
  const [localQuery, setLocalQuery] = useState(controlledQuery ?? "");
  const query = serverMode ? (controlledQuery ?? "") : localQuery;
  const [activeIndex, setActiveIndex] = useState(0);

  const { onDialogKeyDown } = useDialogA11y({
    id: dialogId,
    dialogRef,
    onEscape: onClose,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const items = serverMode
    ? companies
    : companies.filter((company) => matchesCompany(company, query));

  // A stored recent carries the name it had when it was picked, so whenever
  // the live list also holds that company the live copy wins.
  const liveById = new Map(companies.map((c) => [c.id, c]));
  const recentRows = query.trim()
    ? []
    : recentCompanies.map((recent) => liveById.get(recent.id) ?? recent);
  const recentIds = new Set(recentRows.map((c) => c.id));
  const allRows = items.filter((c) => !recentIds.has(c.id));

  // One flat list drives both rendering and the keyboard cursor, so an index
  // can never point at a different row than the one on screen.
  const rows: Row[] = [
    ...(onDeselect && !query.trim() ? [{ kind: "deselect" as const }] : []),
    ...recentRows.map((company) => ({
      kind: "company" as const,
      company,
      section: "recent" as const,
    })),
    ...allRows.map((company) => ({
      kind: "company" as const,
      company,
      section: "all" as const,
    })),
  ];
  const cursor = rows.length === 0 ? 0 : Math.min(activeIndex, rows.length - 1);

  // Keep the highlighted row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView?.({ block: "nearest" });
  }, [cursor]);

  const runRow = (row: Row) => {
    if (row.kind === "deselect") {
      onDeselect?.();
      return;
    }
    onSelect(row.company);
  };

  const moveTo = (index: number) => {
    setActiveIndex(index);
    // Arrowing to the end of the loaded rows pulls the next page, so keyboard
    // users reach the whole list without ever touching the scrollbar.
    if (index >= rows.length - 1 && hasMore && !isLoadingMore) onLoadMore?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveTo(rows.length === 0 ? 0 : (cursor + 1) % rows.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveTo(
        rows.length === 0 ? 0 : cursor <= 0 ? rows.length - 1 : cursor - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[cursor];
      if (row) runRow(row);
    }
  };

  const handleQueryChange = (next: string) => {
    if (serverMode) onQueryChange?.(next);
    else setLocalQuery(next);
    setActiveIndex(0);
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore) return;
    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight >=
      el.scrollHeight - SCROLL_END_THRESHOLD_PX
    ) {
      onLoadMore?.();
    }
  };

  const activeDescendant =
    rows[cursor] != null ? `${listboxId}-opt-${cursor}` : undefined;

  const companyRowCount = recentRows.length + allRows.length;
  const countLabel = copy.resultCount(matchCount ?? companyRowCount);

  // Announced politely: with server-side search this is the only signal a
  // screen reader gets that the list underneath changed.
  const status = isSearching
    ? copy.searching
    : rows.length === 0
      ? copy.empty(query)
      : countLabel;

  const hasActiveCompany = activeCompanyId != null && activeCompanyId !== "";

  const renderRow = (row: Row, index: number) => {
    const isActive = index === cursor;
    const isCurrent =
      row.kind === "deselect"
        ? !hasActiveCompany
        : row.company.id === activeCompanyId;
    const label =
      row.kind === "deselect" ? copy.noCompanyOption : row.company.primaryLabel;
    const sublabel =
      row.kind === "deselect" ? copy.platformOnly : row.company.secondaryLabel;

    return (
      <div
        id={`${listboxId}-opt-${index}`}
        role="option"
        aria-selected={isActive}
        data-active={isActive}
        data-current={isCurrent || undefined}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => runRow(row)}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors",
          isActive
            ? "bg-primary-blue-lightest"
            : "hover:bg-gray-50 dark:hover:bg-slate-800",
        )}
      >
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold",
            row.kind === "deselect"
              ? "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
              : isActive
                ? "bg-primary-blue-lighter text-primary-blue-default"
                : "bg-primary-blue-lightest text-primary-blue-default",
          )}
        >
          {row.kind === "deselect" ? (
            <FontAwesomeIcon icon={faBuilding} aria-hidden="true" />
          ) : (
            getInitials(row.company.primaryLabel)
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-gray-800 dark:text-slate-100">
            {label}
          </span>
          {sublabel && (
            <span className="block truncate text-[11px] text-gray-500 dark:text-slate-400">
              {sublabel}
            </span>
          )}
        </span>
        {isCurrent && (
          <FontAwesomeIcon
            icon={faCheck}
            aria-hidden="true"
            className="text-primary-blue-default shrink-0 text-[12px]"
          />
        )}
      </div>
    );
  };

  return createPortal(
    <div className="animate-fadeIn fixed inset-0 z-9999 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.button === 0) onClose();
        }}
        aria-hidden="true"
        data-testid="company-switcher-backdrop"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        onKeyDown={onDialogKeyDown}
        className="animate-scaleIn relative z-50 flex max-h-[76vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 outline-none dark:bg-slate-900 dark:ring-white/10"
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-slate-800">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-hidden="true"
            className="shrink-0 text-sm text-gray-400 dark:text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeDescendant}
            aria-label={copy.inputAria}
            placeholder={copy.placeholder}
            value={query}
            autoComplete="off"
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-14 flex-1 border-0 bg-transparent text-[15px] text-gray-800 placeholder:text-gray-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          <kbd className="hidden shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-gray-500 sm:block dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {copy.escKey}
          </kbd>
        </div>

        <p aria-live="polite" className="sr-only">
          {status}
        </p>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          id={listboxId}
          aria-label={copy.title}
          aria-busy={isLoading || isSearching || undefined}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-2"
        >
          {isLoading ? (
            <div className="space-y-1 p-1" data-testid="company-switcher-skeleton">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1.5 py-2">
                  <span className="skeleton h-8 w-8 shrink-0 rounded-lg" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="skeleton h-3 w-40 rounded" />
                    <span className="skeleton h-2.5 w-24 rounded" />
                  </span>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="m-0 text-sm text-gray-800 dark:text-slate-100">
                {copy.empty(query)}
              </p>
              <p className="mt-1 mb-0 text-[12px] text-gray-500 dark:text-slate-400">
                {copy.emptyHint}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {rows.map((row, index) => {
                const previous = rows[index - 1];
                const startsSection =
                  row.kind === "company" &&
                  (!previous ||
                    previous.kind === "deselect" ||
                    previous.section !== row.section);
                return (
                  <Fragment
                    key={
                      row.kind === "deselect"
                        ? "deselect"
                        : `${row.section}-${row.company.id}`
                    }
                  >
                    {startsSection && row.kind === "company" && (
                      <div
                        role="presentation"
                        className="px-2 pt-2 pb-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase dark:text-slate-400"
                      >
                        {row.section === "recent"
                          ? copy.recent
                          : copy.allCompanies}
                      </div>
                    )}
                    {renderRow(row, index)}
                  </Fragment>
                );
              })}

              {isLoadingMore && (
                <p className="m-0 px-4 py-3 text-center text-[12px] text-gray-500 dark:text-slate-400">
                  {copy.loadingMore}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-2.5 text-[11px] text-gray-500 dark:border-slate-800 dark:text-slate-400">
          <span className="truncate">{copy.hint}</span>
          <span className="shrink-0">
            {isSearching ? copy.searching : rows.length > 0 ? countLabel : ""}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CompanySwitcherDialog;
