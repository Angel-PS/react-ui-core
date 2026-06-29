import "./styles/index.css";

// ── Primitives ──────────────────────────────────────────────────────────────
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { Select } from "./components/Select";
export type { SelectProps } from "./components/Select";
export { InputCheckbox, InputToggle } from "./components/InputToggle";
export { SearchInput } from "./components/SearchInput";
export type { SearchInputProps } from "./components/SearchInput";
export { MultiSelect } from "./components/MultiSelect";
export type { MultiSelectProps } from "./components/MultiSelect";

// ── Overlays ────────────────────────────────────────────────────────────────
export { Modal } from "./components/Modal";
export type { ModalProps, ModalSize } from "./components/Modal";
export { ConfirmDialog } from "./components/ConfirmDialog";
export type {
  ConfirmDialogProps,
  ConfirmDialogItemDetail,
} from "./components/ConfirmDialog";

// ── Table ───────────────────────────────────────────────────────────────────
export { Table, ColumnManager } from "./components/Table";
export type {
  TableProps,
  TableLabels,
  ColumnManagerLabels,
} from "./components/Table";
export { Pagination } from "./components/Pagination";
export type { PaginationProps, PaginationLabels } from "./components/Pagination";

// ── Filters ─────────────────────────────────────────────────────────────────
export {
  MaintenanceFilters,
  FiltersPopover,
  FilterPills,
  FilterField,
  DebouncedInput,
  useFilterController,
  isFilterApplied,
  filterDisplayValue,
  keysForFilter,
  readFilterValues,
  writeFilterPatch,
  FILTER_RESET_KEYS,
  DEFAULT_FILTERS_LABELS,
} from "./components/Filters";
export type {
  FilterController,
  FilterDef,
  FilterValues,
  FiltersLabels,
  BaseFilter,
  SegmentedFilter,
  SelectFilter,
  TextFilter,
  NumberFilter,
  DateFilter,
  DateRangeFilter,
} from "./components/Filters";

// ── Layout ──────────────────────────────────────────────────────────────────
export {
  MaintenanceLayout,
  SearchToolbar,
  PageActionButton,
} from "./components/MaintenanceLayout";
export type {
  MaintenanceLayoutProps,
  MaintenanceLayoutLabels,
  SearchBarConfig,
  SearchToolbarLabels,
} from "./components/MaintenanceLayout";

// ── App Shell ─────────────────────────────────────────────────────────────────
export { AppLayout } from "./components/AppLayout";
export type {
  AppLayoutProps,
  SidebarSlotState,
  NavbarSlotState,
} from "./components/AppLayout";
export { Sidebar, CompanySwitcher, isPathActive } from "./components/Sidebar";
export type {
  SidebarProps,
  SidebarGroup,
  SidebarItem,
  SidebarLabels,
  CompanyOption,
  CompanySwitcherProps,
  CompanySwitcherLabels,
} from "./components/Sidebar";
export { Navbar } from "./components/Navbar";
export type { NavbarProps, NavbarLabels } from "./components/Navbar";
export { Breadcrumbs, collapseTrail } from "./components/Breadcrumbs";
export type {
  BreadcrumbsProps,
  BreadcrumbsLabels,
  BreadcrumbItem,
} from "./components/Breadcrumbs";
export { AlertBanner } from "./components/AlertBanner";
export type {
  AlertBannerProps,
  AlertBannerLabels,
  AlertBannerTone,
} from "./components/AlertBanner";

// ── Navbar widgets ──────────────────────────────────────────────────────────
export { ThemeToggle } from "./components/ThemeToggle";
export type { ThemeToggleProps, ThemeToggleLabels } from "./components/ThemeToggle";
export { SearchTrigger } from "./components/SearchTrigger";
export type {
  SearchTriggerProps,
  SearchTriggerLabels,
} from "./components/SearchTrigger";
export { UserMenu } from "./components/UserMenu";
export type {
  UserMenuProps,
  UserMenuItem,
  UserMenuLabels,
} from "./components/UserMenu";
export { LanguageSwitcher } from "./components/LanguageSwitcher";
export type {
  LanguageSwitcherProps,
  LanguageSwitcherLabels,
  LanguageOption,
} from "./components/LanguageSwitcher";
export { NewActionMenu } from "./components/NewActionMenu";
export type {
  NewActionMenuProps,
  NewActionMenuLabels,
  NewActionGroup,
  NewActionOption,
} from "./components/NewActionMenu";
export { NotificationBell, NotificationListItem } from "./components/NotificationBell";
export type {
  NotificationBellProps,
  NotificationBellLabels,
  NotificationListItemProps,
  NotificationItem,
} from "./components/NotificationBell";
export { CommandPalette, filterSections } from "./components/CommandPalette";
export type {
  CommandPaletteProps,
  CommandPaletteLabels,
  CommandSection,
  CommandItem,
} from "./components/CommandPalette";

// ── Hooks ───────────────────────────────────────────────────────────────────
export { useClickOutside } from "./hooks";

// ── Lib ─────────────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";
export { getStatusStyle, statusStyles } from "./lib/statusStyles";
export { applyColumnPrefs } from "./lib/applyColumnPrefs";
export {
  formatDate,
  formatDecimal,
  getInitials,
  cleanStatusValue,
  capitalizeWords,
} from "./lib/format";

// ── Types ───────────────────────────────────────────────────────────────────
export type {
  Option,
  Metadata,
  HeaderColumn,
  Column,
  RowColumn,
  TableAction,
  ExpandField,
  PageAction,
  TableColumnPref,
} from "./types";
