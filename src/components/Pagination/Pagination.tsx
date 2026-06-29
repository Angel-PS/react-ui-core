import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export interface PaginationLabels {
  rowsPerPage: string;
  previous: string;
  next: string;
  showing: (info: { from: number; to: number; total: number }) => string;
  goToPage: (page: number) => string;
}

const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  rowsPerPage: "Rows per page",
  previous: "Previous",
  next: "Next",
  showing: ({ from, to, total }) => `Showing ${from}–${to} of ${total}`,
  goToPage: (page) => `Go to page ${page}`,
};

export interface PaginationProps {
  count: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  rowsPerPageOptions?: number[];
  labels?: Partial<PaginationLabels>;
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [25, 50, 100, 200];

const getPageRange = (
  current: number,
  total: number,
): (number | "ellipsis-left" | "ellipsis-right")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis-left");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis-right");

  pages.push(total);
  return pages;
};

export const Pagination: FC<PaginationProps> = ({
  count,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  labels,
}) => {
  const l = { ...DEFAULT_PAGINATION_LABELS, ...labels };
  const rowsPerPage = pageSize;

  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const from = count === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const to = Math.min(safePage * rowsPerPage, count);

  const goToPage = (newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    if (clamped === safePage) return;
    onPageChange(clamped);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onPageSizeChange?.(Number(event.target.value));
  };

  const pageRange = getPageRange(safePage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          disabled={!onPageSizeChange}
          className="h-8! cursor-pointer rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2! py-0! text-xs text-slate-600 dark:text-slate-300 shadow-xs transition-colors hover:border-slate-300 focus:border-primary-blue-default focus:outline-none"
          aria-label={l.rowsPerPage}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>{l.showing({ from, to, total: count })}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(safePage - 1)}
          disabled={safePage === 1}
          aria-label={l.previous}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-transparent"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
        </button>

        {pageRange.map((item) => {
          if (item === "ellipsis-left" || item === "ellipsis-right") {
            return (
              <span
                key={item}
                className="flex size-9 items-center justify-center text-sm text-slate-400"
              >
                …
              </span>
            );
          }
          const isActive = item === safePage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              aria-label={l.goToPage(item)}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "bg-primary-blue-default flex size-9 cursor-default items-center justify-center rounded-lg text-sm font-semibold text-white shadow-sm"
                  : "flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => goToPage(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label={l.next}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-transparent"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
