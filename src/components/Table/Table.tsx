import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faChevronDown,
  faArrowUp,
  faArrowDown,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import type {
  HeaderColumn,
  RowColumn,
  TableAction,
  ExpandField,
  Metadata,
} from "../../types";
import {
  formatDate,
  formatDecimal,
  getInitials,
  cleanStatusValue,
} from "../../lib/format";
import { getStatusStyle } from "../../lib/statusStyles";
import { Pagination } from "../Pagination";

export interface TableLabels {
  noRecords: string;
  actions: string;
  expand: string;
  collapse: string;
  sort: { asc: string; desc: string; clear: string };
  /** Optional status display map; falls back to a cleaned-up version of the value. */
  status?: Record<string, string>;
}

const DEFAULT_TABLE_LABELS: TableLabels = {
  noRecords: "No records",
  actions: "Actions",
  expand: "Expand",
  collapse: "Collapse",
  sort: { asc: "Sort ascending", desc: "Sort descending", clear: "Clear sort" },
};

export interface TableProps {
  headers: HeaderColumn[];
  data: RowColumn[];
  actions?: TableAction[];
  expandFields?: ExpandField[];
  metadata?: Metadata;
  isLoading?: boolean;
  /** Controlled sort: a header `sortKey` ("name" asc, "-name" desc) or null. */
  sort?: string | null;
  onSortChange?: (next: string | null) => void;
  /** Forwarded to the footer <Pagination> when `metadata.pagination` is present. */
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Page size fallback when `metadata.pagination.size` is absent. Default 25. */
  defaultPageSize?: number;
  /**
   * Rendered inside the card, above the column headers — the counterpart to the
   * `<Pagination>` footer. Built for `<TableFreshnessBar>`.
   */
  toolbar?: React.ReactNode;
  /**
   * A refresh is in flight over rows that are already on screen. Unlike
   * `isLoading` (which swaps the body for skeletons) this keeps the rows and
   * only marks them busy, so a manual refresh never blanks the table.
   */
  isRefreshing?: boolean;
  labels?: Partial<TableLabels>;
}

const SKELETON_WIDTHS = [
  "60%",
  "80%",
  "45%",
  "70%",
  "55%",
  "85%",
  "50%",
  "65%",
];
const SKELETON_ROW_COUNT = 6;

const AVATAR_COLORS = [
  "#4061a8",
  "#0d7490",
  "#2e7d5b",
  "#b45309",
  "#9d174d",
  "#334155",
  "#6366f1",
  "#0891b2",
];

function getAvatarColor(id: string | number): string {
  const num =
    typeof id === "number"
      ? id
      : String(id)
          .split("")
          .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[num % AVATAR_COLORS.length];
}

type AvatarCellProps = {
  id: string | number;
  name: string | number;
  subtitle?: string | number;
  alignClass: string;
  cellKey: string;
};

const AvatarCell = ({
  id,
  name,
  subtitle,
  alignClass,
  cellKey,
}: AvatarCellProps) => (
  <td key={cellKey} className={`px-5 py-3 ${alignClass}`}>
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
        style={{
          backgroundColor: getAvatarColor(id),
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(0,0,0,0.10))",
        }}
      >
        {getInitials(String(name))}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-gray-800 dark:text-slate-100">
          {name}
        </div>
        {subtitle && (
          <div className="max-w-[200px] truncate text-xs text-gray-400 dark:text-slate-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  </td>
);

const menuItemBase =
  "flex w-full items-center gap-2.5 bg-transparent px-4 py-2.5 text-left text-sm font-normal leading-none transition-colors duration-150 rounded-none";

const ActionMenu = ({
  actions,
  rowId,
  onClose,
}: {
  actions: TableAction[];
  rowId: string | number;
  onClose: () => void;
}) => (
  <>
    {actions.map((action, i) => (
      <button
        key={i}
        disabled={action.disabled?.(rowId)}
        className={`${menuItemBase} ${
          action.variant === "danger"
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
        } ${
          action.disabled?.(rowId)
            ? "cursor-not-allowed text-slate-400! hover:bg-transparent hover:text-slate-400"
            : ""
        }`}
        onClick={() => {
          if (action.disabled?.(rowId)) return;
          action.onClick(rowId);
          onClose();
        }}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-60">
          {action.icon}
        </span>
        {action.label}
      </button>
    ))}
  </>
);

export const Table = ({
  headers,
  data,
  actions = [],
  expandFields,
  metadata,
  isLoading = false,
  sort = null,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = 25,
  toolbar,
  isRefreshing = false,
  labels,
}: TableProps) => {
  const l: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...labels,
    sort: { ...DEFAULT_TABLE_LABELS.sort, ...labels?.sort },
  };

  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    rowId: string | number;
  } | null>(null);

  const getVisibleActions = useCallback(
    (row: RowColumn): TableAction[] =>
      actions.filter((action) => !action.hidden?.(row)),
    [actions],
  );

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-table-menu]")) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
      if (!target.closest("[data-table-context]")) {
        setContextMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setMenuPosition(null);
        setContextMenu(null);
      }
    };
    const onScroll = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleKebabClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    rowId: string | number,
  ) => {
    e.stopPropagation();
    setContextMenu(null);
    if (openMenuId === rowId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenMenuId(rowId);
    setMenuPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 176,
    });
  };

  const handleContextMenu = (e: React.MouseEvent, row: RowColumn) => {
    e.preventDefault();
    const visible = getVisibleActions(row);
    if (visible.length === 0) return;
    setOpenMenuId(null);
    setMenuPosition(null);
    setContextMenu({ x: e.clientX, y: e.clientY, rowId: row.id });
  };

  const openMenuRow =
    openMenuId != null ? data.find((r) => r.id === openMenuId) : null;
  const openMenuActions = openMenuRow ? getVisibleActions(openMenuRow) : [];

  const ctxRow = contextMenu
    ? data.find((r) => r.id === contextMenu.rowId)
    : null;
  const ctxActions = ctxRow ? getVisibleActions(ctxRow) : [];

  const hasActionsColumn = actions.length > 0;
  const hasExpandColumn = !!expandFields?.length;
  const totalCols =
    headers.length + (hasActionsColumn ? 1 : 0) + (hasExpandColumn ? 1 : 0);

  // Controlled sort, derived from the `sort` prop ("key" asc, "-key" desc).
  const activeSortKey = sort?.startsWith("-") ? sort.slice(1) : sort;
  const activeSortDir: "asc" | "desc" | null = sort
    ? sort.startsWith("-")
      ? "desc"
      : "asc"
    : null;

  const handleSortClick = (sortKey: string) => {
    let next: string | null;
    if (sort === sortKey) next = `-${sortKey}`;
    else if (sort === `-${sortKey}`) next = null;
    else next = sortKey;
    onSortChange?.(next);
  };

  const formatExpandValue = (field: ExpandField, raw: string | number) => {
    switch (field.dataType) {
      case "date":
        return formatDate(String(raw), "DD-MM-YYYY");
      case "datetime":
        return formatDate(String(raw), "DD-MM-YYYY", true);
      case "decimal":
        return formatDecimal(Number(raw));
      default:
        return String(raw);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {toolbar}
      <div
        aria-busy={isRefreshing || undefined}
        className="max-h-[60dvh] overflow-x-auto overflow-y-auto"
      >
        <table className="w-full border-collapse text-left">
          {/* ── Header ── */}
          <thead className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <tr className="border-b border-gray-200 dark:border-slate-800">
              {hasExpandColumn && <th className="w-10 px-3 py-3.5" />}
              {headers.map((header) => {
                const justify = header.justify ?? "left";

                if (!header.sortKey) {
                  return (
                    <th
                      key={header.accessor}
                      className={`truncate px-5 py-3.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-300 text-${justify}`}
                    >
                      {header.value}
                    </th>
                  );
                }

                const isActive = activeSortKey === header.sortKey;
                const direction = isActive ? activeSortDir : null;
                const nextActionLabel =
                  direction === "asc"
                    ? l.sort.desc
                    : direction === "desc"
                      ? l.sort.clear
                      : l.sort.asc;

                const sortIcon = (
                  <FontAwesomeIcon
                    icon={direction === "desc" ? faArrowDown : faArrowUp}
                    className={`h-3 w-3 shrink-0 transition-all duration-150 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover/sort:opacity-60"
                    }`}
                  />
                );

                return (
                  <th
                    key={header.accessor}
                    aria-sort={
                      direction === "asc"
                        ? "ascending"
                        : direction === "desc"
                          ? "descending"
                          : undefined
                    }
                    className={`px-2 py-1.5 whitespace-nowrap text-${justify}`}
                  >
                    <button
                      type="button"
                      title={nextActionLabel}
                      aria-label={nextActionLabel}
                      onClick={() => handleSortClick(header.sortKey!)}
                      className={`group/sort inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-lg bg-transparent px-3 py-2 text-[11px] font-semibold tracking-wider uppercase transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        isActive
                          ? "text-primary-blue-default"
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                      }`}
                    >
                      {justify === "right" && sortIcon}
                      <span className="truncate">{header.value}</span>
                      {justify !== "right" && sortIcon}
                    </button>
                  </th>
                );
              })}
              {hasActionsColumn && (
                <th className="w-12 px-5 py-3.5 text-center text-[11px] font-semibold tracking-widest text-slate-400 uppercase" />
              )}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody
            className={`divide-y divide-slate-50 transition-opacity duration-200 motion-reduce:transition-none dark:divide-slate-800 ${
              isRefreshing ? "opacity-60" : "opacity-100"
            }`}
          >
            {isLoading &&
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {hasExpandColumn && (
                    <td className="w-10 px-3 py-3.5">
                      <div className="skeleton mx-auto h-4 w-4" />
                    </td>
                  )}
                  {headers.map((header, colIndex) => (
                    <td
                      key={`skeleton-${rowIndex}-${header.accessor}`}
                      className="px-5 py-3.5"
                    >
                      <div
                        className="skeleton h-3.5"
                        style={{
                          width:
                            SKELETON_WIDTHS[
                              (rowIndex + colIndex) % SKELETON_WIDTHS.length
                            ],
                        }}
                      />
                    </td>
                  ))}
                  {hasActionsColumn && (
                    <td className="px-5 py-3.5 text-center">
                      <div className="skeleton mx-auto h-4 w-4" />
                    </td>
                  )}
                </tr>
              ))}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={totalCols} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <FontAwesomeIcon icon={faInbox} className="text-lg" />
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {l.noRecords}
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading &&
              data.map((row, rowIndex) => {
                const visibleActions = getVisibleActions(row);
                const isExpanded = expandedRows.has(row.id);
                const canExpand = hasExpandColumn && !!row.expandData;

                return (
                  <React.Fragment key={rowIndex}>
                    <tr
                      className="group transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onContextMenu={(e) => handleContextMenu(e, row)}
                    >
                      {/* ── Expand toggle cell ── */}
                      {hasExpandColumn && (
                        <td className="w-10 px-3 py-3.5 text-center">
                          {canExpand && (
                            <button
                              title={isExpanded ? l.collapse : l.expand}
                              className="inline-flex items-center justify-center rounded-lg bg-transparent p-1.5 font-normal text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                              onClick={() =>
                                setExpandedRows((prev) => {
                                  const next = new Set(prev);
                                  if (isExpanded) {
                                    next.delete(row.id);
                                  } else {
                                    next.add(row.id);
                                  }
                                  return next;
                                })
                              }
                            >
                              <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                        </td>
                      )}

                      {headers.map((header) => {
                        const column = row.columns.find(
                          (c) => c.accessor === header.accessor,
                        );
                        if (!column)
                          return (
                            <td
                              key={`${rowIndex}-${header.accessor}`}
                              className="px-5 py-3.5"
                            />
                          );

                        const alignClass = header.justify
                          ? `text-${header.justify}`
                          : "text-left";
                        const key = `${rowIndex}-${column.accessor}`;

                        switch (column.dataType) {
                          case "date":
                            return (
                              <td
                                key={key}
                                className={`truncate px-5 py-3.5 text-sm text-slate-500 dark:text-slate-300 ${alignClass}`}
                              >
                                {formatDate(String(column.value), "DD-MM-YYYY")}
                              </td>
                            );
                          case "datetime":
                            return (
                              <td
                                key={key}
                                className={`truncate px-5 py-3.5 text-sm text-slate-500 dark:text-slate-300 ${alignClass}`}
                              >
                                {formatDate(
                                  String(column.value),
                                  "DD-MM-YYYY",
                                  true,
                                )}
                              </td>
                            );
                          case "decimal":
                            return (
                              <td
                                key={key}
                                className={`px-5 py-3.5 text-sm font-medium text-slate-700 tabular-nums dark:text-slate-200 ${alignClass}`}
                              >
                                {formatDecimal(Number(column.value))}
                              </td>
                            );
                          case "status": {
                            const { dot, badge } = getStatusStyle(
                              String(column.value),
                            );

                            if (!column.value) return <td key={key}></td>;

                            const rawValue = String(column.value);
                            const display =
                              l.status?.[rawValue] ?? cleanStatusValue(rawValue);

                            return (
                              <td
                                key={key}
                                className={`truncate px-5 py-3.5 ${alignClass}`}
                              >
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-black/5 dark:ring-white/10 ring-inset ${badge}`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
                                  />
                                  {display}
                                </span>
                              </td>
                            );
                          }
                          case "avatar":
                            return (
                              <AvatarCell
                                key={key}
                                cellKey={key}
                                id={row.id}
                                name={column.value}
                                subtitle={column.subValue}
                                alignClass={alignClass}
                              />
                            );
                          default:
                            return (
                              <td
                                key={key}
                                className={`truncate px-5 py-3.5 text-sm text-slate-700 dark:text-slate-100 ${alignClass}`}
                              >
                                {column.value}
                              </td>
                            );
                        }
                      })}

                      {/* ── Actions cell ── */}
                      {hasActionsColumn && (
                        <td className="px-5 py-3.5 text-center">
                          {visibleActions.length > 0 && (
                            <button
                              data-table-menu="true"
                              title={l.actions}
                              className="inline-flex items-center justify-center rounded-lg bg-transparent p-1.5 font-normal text-slate-400 transition-all duration-150 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                              onClick={(e) => handleKebabClick(e, row.id)}
                            >
                              <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                className="h-4 w-4"
                              />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>

                    {/* ── Expanded row ── */}
                    {canExpand && isExpanded && (
                      <tr
                        key={`${rowIndex}-expand`}
                        className="bg-slate-50 dark:bg-slate-950"
                      >
                        <td colSpan={totalCols} className="px-6 py-4">
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {expandFields!.map((field) => {
                              const raw = row.expandData![field.accessor];
                              if (raw === undefined || raw === null) return null;
                              const isNode = React.isValidElement(raw);
                              return (
                                <div
                                  key={field.accessor}
                                  className={`flex flex-col gap-0.5 ${isNode ? "basis-full" : ""}`}
                                >
                                  <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                                    {field.label}
                                  </span>
                                  {isNode ? (
                                    raw
                                  ) : (
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                      {formatExpandValue(
                                        field,
                                        raw as string | number,
                                      )}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
      {metadata?.pagination && (metadata.pagination.count ?? 0) > 0 && (
        <Pagination
          count={metadata.pagination.count!}
          currentPage={metadata.pagination.current ?? 1}
          pageSize={metadata.pagination.size ?? defaultPageSize}
          onPageChange={onPageChange ?? (() => {})}
          onPageSizeChange={onPageSizeChange}
        />
      )}

      {/* ── Kebab dropdown ── */}
      {openMenuId != null &&
        menuPosition &&
        openMenuActions.length > 0 &&
        createPortal(
          <div
            data-table-menu="true"
            className="fixed z-9999 w-44 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1 shadow-lg"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <ActionMenu
              actions={openMenuActions}
              rowId={openMenuId}
              onClose={() => {
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
            />
          </div>,
          document.body,
        )}

      {/* ── Right-click context menu ── */}
      {contextMenu &&
        ctxActions.length > 0 &&
        createPortal(
          <div
            data-table-context="true"
            className="fixed z-9999 w-44 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1 shadow-lg"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <ActionMenu
              actions={ctxActions}
              rowId={contextMenu.rowId}
              onClose={() => setContextMenu(null)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Table;
