import { useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  ColumnManager,
  type TableLabels,
  type ColumnManagerLabels,
} from "../Table";
import type { PaginationLabels } from "../Pagination";
import { Button } from "../Button";
import { ConfirmDialog, type ConfirmDialogItemDetail } from "../ConfirmDialog";
import {
  MaintenanceFilters,
  type FilterController,
  type FiltersLabels,
} from "../Filters";
import {
  TableFreshnessBar,
  type TableFreshnessLabels,
} from "../TableFreshnessBar";
import { applyColumnPrefs } from "../../lib/applyColumnPrefs";
import type { StatusStyle } from "../../lib/statusStyles";
import type {
  HeaderColumn,
  RowColumn,
  TableAction,
  ExpandField,
  Metadata,
  PageAction,
  TableColumnPref,
} from "../../types";
import {
  PageActionButton,
  SearchToolbar,
  type SearchBarConfig,
} from "./SearchToolbar";

// ─── Labels ─────────────────────────────────────────────────────────────────

export interface MaintenanceLayoutLabels {
  view: string;
  edit: string;
  delete: string;
  addNew: string;
  /** Search box placeholder (a `searchBar.placeholder` still wins). */
  searchPlaceholder?: string;
  /** The "N results" text next to the toolbar actions. */
  resultCount?: (count: number) => string;
  /** Text for the freshness strip, only used when `refresh` is wired. */
  refresh: Partial<TableFreshnessLabels>;
  confirmDelete: {
    title: string;
    description: string;
    confirm: string;
    cancel: string;
    warning: string;
  };
}

const DEFAULT_LABELS: MaintenanceLayoutLabels = {
  view: "View",
  edit: "Edit",
  delete: "Delete",
  addNew: "Add new",
  // Left empty so <TableFreshnessBar> keeps its own English defaults; a
  // consumer overrides individual strings without restating the whole set.
  refresh: {},
  confirmDelete: {
    title: "Delete record",
    description: "This action cannot be undone.",
    confirm: "Delete",
    cancel: "Cancel",
    warning: "This action is permanent",
  },
};

const mergeLabels = (
  labels?: Partial<MaintenanceLayoutLabels>,
): MaintenanceLayoutLabels => ({
  ...DEFAULT_LABELS,
  ...labels,
  confirmDelete: { ...DEFAULT_LABELS.confirmDelete, ...labels?.confirmDelete },
  refresh: { ...DEFAULT_LABELS.refresh, ...labels?.refresh },
});

// ─── Types ──────────────────────────────────────────────────────────────────

type BaseMaintenanceLayoutProps = {
  headers: HeaderColumn[];
  data: RowColumn[];
  title?: string;
  description?: string;
  canCreate?: boolean;
  canActions?: boolean;
  canEdit?: boolean;
  canView?: boolean;
  canDelete?: boolean;
  onDelete?: (id: number | string) => void | Promise<unknown>;
  deleteItemLabel?: (row: RowColumn) => {
    title?: string;
    description?: string;
    details?: ConfirmDialogItemDetail[];
  };
  expandFields?: ExpandField[];
  /**
   * Declarative filter bar rendered above the table. Pass the controller from
   * `useFilterController(filterDefs)` (or your own implementation).
   */
  filters?: FilterController;
  metadata?: Metadata;
  searchBar?: SearchBarConfig;
  isLoading?: boolean;
  extraActions?: TableAction[];
  pageActions?: PageAction[];
  /**
   * Opt-in to the per-table column manager (show/hide + reorder). Pass a STABLE,
   * unique identifier — it's only used to gate the manager on; persistence is
   * the consumer's job via `columnPref` + `onColumnChange`.
   */
  tableKey?: string;
  /** Committed column preference for this table (controlled). */
  columnPref?: TableColumnPref;
  /** Called when the user applies a new column layout — persist it and feed it back via `columnPref`. */
  onColumnChange?: (next: TableColumnPref) => void;
  /**
   * Wire the list's fetch state to render the freshness strip above the table:
   * when the rows were last read, plus the control that reads them again.
   * Deliberately plain props — the library knows nothing about your data layer.
   */
  refresh?: {
    /** Epoch ms of the last successful fetch. */
    updatedAt?: number;
    /**
     * A refresh the USER started is in flight (rows stay on screen, dimmed).
     * Don't pass a data layer's generic "fetching" flag here: a filter or page
     * change would then dim the old rows instead of showing skeletons. Prefer
     * returning a Promise from `onRefresh` — the layout tracks it for you.
     */
    isRefreshing?: boolean;
    /**
     * Read the rows again. Return the refetch Promise and the layout tracks the
     * manual refresh itself: repeat clicks are ignored until it settles.
     */
    onRefresh: () => void | Promise<unknown>;
    /** BCP-47 tag for the relative label. Default "en". */
    locale?: string;
    /** IANA zone for the absolute tooltip. Omit for the viewer's own zone. */
    timeZone?: string;
  };

  // ── Decoupling props ──
  /** Replaces router navigation. Page mode calls this with the resolved path. */
  onNavigate?: (path: string) => void;
  /** Open the create form on mount (was the `?quick-action=add` URL trigger). */
  defaultShowCreate?: boolean;
  /** UI text overrides (English by default). */
  labels?: Partial<MaintenanceLayoutLabels>;
  /** Text overrides forwarded to the inner <Table> (e.g. a `status` display map). */
  tableLabels?: Partial<TableLabels>;
  /** Text overrides forwarded to the column manager (only with `tableKey`). */
  columnManagerLabels?: Partial<ColumnManagerLabels>;
  /** Text overrides forwarded to the filter bar (Filters / Apply / Clear all…). */
  filtersLabels?: Partial<FiltersLabels>;
  /** Text overrides forwarded to the table's footer pagination. */
  paginationLabels?: Partial<PaginationLabels>;
  /** Page-size options for the footer pagination. */
  rowsPerPageOptions?: number[];
  /** IANA zone for date cells (and the freshness tooltip unless `refresh.timeZone` is set). */
  timeZone?: string;
  /** Extra status → badge classes for `status` cells, merged over the defaults. */
  statusStyles?: Record<string, StatusStyle>;
  /** Debounce the search box's `onSearchChange` by this many ms (e.g. 400). */
  searchDebounceMs?: number;

  // ── Controlled table state (forwarded to <Table>) ──
  sort?: string | null;
  onSortChange?: (next: string | null) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

type ModalMaintenanceLayoutProps = BaseMaintenanceLayoutProps & {
  maintenanceType: "modal";
  createPath?: never;
  editPath?: never;
  viewPath?: never;
  MaintenanceModal: FC<
    | { isEdit?: false; id?: never; onHide: () => void }
    | { isEdit: true; id: number | string; onHide: () => void }
  >;
};

type PageMaintenanceLayoutProps = BaseMaintenanceLayoutProps & {
  maintenanceType: "page";
  createPath: string;
  editPath: string;
  viewPath?: string;
  MaintenanceModal?: never;
};

export type MaintenanceLayoutProps =
  | ModalMaintenanceLayoutProps
  | PageMaintenanceLayoutProps;

// ─── MaintenanceLayout ────────────────────────────────────────────────────────

export const MaintenanceLayout: FC<MaintenanceLayoutProps> = ({
  headers,
  data,
  canCreate = true,
  canActions = true,
  canEdit,
  canView = false,
  canDelete = false,
  onDelete,
  deleteItemLabel,
  maintenanceType = "page",
  createPath,
  editPath,
  viewPath,
  MaintenanceModal,
  expandFields,
  filters,
  metadata,
  searchBar,
  isLoading,
  extraActions,
  pageActions,
  title,
  description,
  tableKey,
  columnPref,
  onColumnChange,
  onNavigate,
  defaultShowCreate = false,
  labels,
  tableLabels,
  columnManagerLabels,
  filtersLabels,
  paginationLabels,
  rowsPerPageOptions,
  timeZone,
  statusStyles,
  searchDebounceMs,
  sort = null,
  onSortChange,
  searchValue,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  refresh,
}) => {
  const [showCreate, setShowCreate] = useState(defaultShowCreate && canCreate);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [pendingDeleteRow, setPendingDeleteRow] = useState<RowColumn | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const l = mergeLabels(labels);

  // Per-table column layout (only active when the consumer opts in via
  // `tableKey`). Applied even without a saved pref, so optional
  // (`defaultHidden`) columns start hidden for users who never customized.
  const headersToRender = tableKey
    ? applyColumnPrefs(headers, columnPref)
    : headers;
  const columnManager =
    tableKey && headers.length >= 2 ? (
      <ColumnManager
        columns={headers}
        pref={columnPref}
        onApply={(next) => onColumnChange?.(next)}
        labels={columnManagerLabels}
      />
    ) : null;

  // A user-started refresh, tracked apart from `isLoading` on purpose: it keeps
  // the rows on screen (dimmed), while a filter / search / page change still
  // swaps them for skeletons.
  const isRefreshing = !!refresh?.isRefreshing || isManualRefresh;

  function handleRefresh() {
    if (!refresh || isRefreshing) return;
    const result = refresh.onRefresh();
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setIsManualRefresh(true);
      void Promise.resolve(result)
        .catch(() => {})
        .finally(() => setIsManualRefresh(false));
    }
  }

  function handleCreate() {
    if (maintenanceType === "modal") {
      setShowCreate(true);
      return;
    }
    if (maintenanceType === "page" && createPath) {
      onNavigate?.(createPath);
    }
  }

  function handleEdit(id: number | string) {
    if (maintenanceType === "modal") {
      setEditId(id);
      return;
    }
    if (maintenanceType === "page" && editPath) {
      onNavigate?.(`${editPath}/${id}`);
    }
  }

  function handleView(id: number | string) {
    if (maintenanceType === "page" && viewPath) {
      onNavigate?.(`${viewPath}/${id}`);
    }
  }

  function handleDeleteClick(id: number | string) {
    const row = data.find((r) => r.id === id);
    if (row) setPendingDeleteRow(row);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteRow || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(pendingDeleteRow.id);
      setPendingDeleteRow(null);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelDelete() {
    if (isDeleting) return;
    setPendingDeleteRow(null);
  }

  const deleteInfo = pendingDeleteRow
    ? deleteItemLabel?.(pendingDeleteRow)
    : undefined;

  const actions: TableAction[] = [];

  if (canActions) {
    if (canView) {
      actions.push({
        label: l.view,
        icon: <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />,
        onClick: handleView,
      });
    }
    if (canEdit ?? true) {
      actions.push({
        label: l.edit,
        icon: <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />,
        onClick: handleEdit,
        hidden: (row) => row.showActions === false,
      });
    }

    if (canDelete && onDelete) {
      actions.push({
        label: l.delete,
        icon: <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />,
        onClick: handleDeleteClick,
        hidden: (row) => row.showActions === false || row.canDelete === false,
        variant: "danger",
      });
    }

    if (extraActions?.length) {
      actions.push(...extraActions);
    }
  }

  return (
    <div>
      {showCreate && maintenanceType === "modal" && MaintenanceModal && (
        <MaintenanceModal onHide={() => setShowCreate(false)} />
      )}
      {editId && maintenanceType === "modal" && MaintenanceModal && (
        <MaintenanceModal
          id={editId}
          isEdit={true}
          onHide={() => setEditId(null)}
        />
      )}

      <ConfirmDialog
        isOpen={pendingDeleteRow !== null}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={deleteInfo?.title ?? l.confirmDelete.title}
        description={deleteInfo?.description ?? l.confirmDelete.description}
        confirmLabel={l.confirmDelete.confirm}
        cancelLabel={l.confirmDelete.cancel}
        warningFooter={l.confirmDelete.warning}
        itemDetails={deleteInfo?.details}
        isLoading={isDeleting}
        variant="danger"
      />

      {(title || description) && (
        <div className="mt-6 mb-2">
          {title && (
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={title || description ? "mt-4" : "mt-10"}>
        {searchBar ? (
          <SearchToolbar
            {...searchBar}
            onCreateClick={handleCreate}
            canCreate={canCreate}
            pageActions={pageActions}
            columnManager={columnManager}
            searchValue={searchValue ?? ""}
            onSearchChange={onSearchChange ?? (() => {})}
            searchDebounceMs={searchDebounceMs}
            labels={{
              addNew: l.addNew,
              ...(l.searchPlaceholder && {
                searchPlaceholder: l.searchPlaceholder,
              }),
              ...(l.resultCount && { resultCount: l.resultCount }),
            }}
          />
        ) : (
          <div className="mb-4 flex items-center justify-end gap-2">
            {columnManager}
            {pageActions?.map((action, idx) => (
              <PageActionButton key={`${action.label}-${idx}`} action={action} />
            ))}
            {canCreate && (
              <Button onClick={handleCreate}>{l.addNew}</Button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {filters && filters.filters.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <MaintenanceFilters
                controller={filters}
                labels={filtersLabels}
              />
            </div>
          )}
          <Table
            data={data}
            headers={headersToRender}
            actions={actions}
            expandFields={expandFields}
            metadata={metadata}
            isLoading={isLoading && !isRefreshing}
            isRefreshing={isRefreshing}
            toolbar={
              refresh ? (
                <TableFreshnessBar
                  updatedAt={refresh.updatedAt}
                  isRefreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  locale={refresh.locale}
                  timeZone={refresh.timeZone ?? timeZone}
                  labels={l.refresh}
                />
              ) : undefined
            }
            sort={sort}
            onSortChange={onSortChange}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            timeZone={timeZone}
            statusStyles={statusStyles}
            rowsPerPageOptions={rowsPerPageOptions}
            labels={tableLabels}
            paginationLabels={paginationLabels}
          />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceLayout;
