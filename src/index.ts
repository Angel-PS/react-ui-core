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
export { MultiSelect, DEFAULT_MULTISELECT_LABELS } from "./components/MultiSelect";
export type { MultiSelectProps, MultiSelectLabels } from "./components/MultiSelect";
export {
  CurrencyInput,
  clampNumber,
  parseCurrencyText,
  formatCurrencyLive,
} from "./components/CurrencyInput";
export type { CurrencyInputProps } from "./components/CurrencyInput";
export {
  ColorInput,
  DEFAULT_COLOR_PRESETS,
  DEFAULT_COLOR_INPUT_LABELS,
  isHexColor,
  normalizeHex,
} from "./components/ColorInput";
export type { ColorInputProps, ColorInputLabels } from "./components/ColorInput";
export { TagInput, cleanTag, splitPastedTags } from "./components/TagInput";
export type { TagInputProps } from "./components/TagInput";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export {
  Tabs,
  TabPanel,
  tabId,
  tabPanelId,
  DEFAULT_TABS_LABELS,
} from "./components/Tabs";
export type {
  TabItem,
  TabsProps,
  TabsLabels,
  TabPanelProps,
} from "./components/Tabs";

export { FormActions, DEFAULT_FORM_ACTIONS_LABELS } from "./components/FormActions";
export type { FormActionsProps, FormActionsLabels } from "./components/FormActions";

// ── Feedback ────────────────────────────────────────────────────────────────
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";
export { ErrorState, DEFAULT_ERROR_STATE_LABELS } from "./components/ErrorState";
export type { ErrorStateProps, ErrorStateLabels } from "./components/ErrorState";
export { ErrorBoundary, DEFAULT_ERROR_BOUNDARY_LABELS } from "./components/ErrorBoundary";
export type {
  ErrorBoundaryProps,
  ErrorBoundaryLabels,
} from "./components/ErrorBoundary";

// ── Data ────────────────────────────────────────────────────────────────────
export { Sparkline, sparklinePath } from "./components/Sparkline";
export type { SparklineProps, SparklinePaths } from "./components/Sparkline";
export { Trend } from "./components/Trend";
export type { TrendProps, TrendLabels } from "./components/Trend";

// ── Overlays ────────────────────────────────────────────────────────────────
export { Modal } from "./components/Modal";
export type { ModalProps, ModalSize } from "./components/Modal";
export { ConfirmDialog } from "./components/ConfirmDialog";
export type {
  ConfirmDialogProps,
  ConfirmDialogItemDetail,
} from "./components/ConfirmDialog";
export { ModalHeader, DEFAULT_MODAL_HEADER_LABELS } from "./components/ModalHeader";
export type { ModalHeaderProps, ModalHeaderLabels } from "./components/ModalHeader";

// ── Table ───────────────────────────────────────────────────────────────────
export { Table, ColumnManager } from "./components/Table";
export type {
  TableProps,
  TableLabels,
  ColumnManagerLabels,
  ColumnManagerProps,
} from "./components/Table";
export { TableFreshnessBar } from "./components/TableFreshnessBar";
export type {
  TableFreshnessBarProps,
  TableFreshnessLabels,
} from "./components/TableFreshnessBar";
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
export { SectionHeading } from "./components/SectionHeading";
export type { SectionHeadingProps } from "./components/SectionHeading";
export { Card, SettingRow } from "./components/Card";
export type { CardProps, SettingRowProps } from "./components/Card";

// ── App Shell ─────────────────────────────────────────────────────────────────
export { AppLayout } from "./components/AppLayout";
export type {
  AppLayoutProps,
  SidebarSlotState,
  NavbarSlotState,
} from "./components/AppLayout";
export {
  CompanySwitcherDialog,
  DEFAULT_COMPANY_SWITCHER_DIALOG_LABELS,
  matchesCompany,
} from "./components/CompanySwitcherDialog";
export type {
  CompanySwitcherDialogProps,
  CompanySwitcherDialogLabels,
} from "./components/CompanySwitcherDialog";
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
  UserMenuNameBreakpoint,
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
export {
  NotificationBell,
  NotificationListItem,
  notificationTones,
  getNotificationToneStyle,
} from "./components/NotificationBell";
export type {
  NotificationBellProps,
  NotificationBellLabels,
  NotificationListItemProps,
  NotificationListItemLabels,
  NotificationItem,
  NotificationTone,
  NotificationToneStyle,
} from "./components/NotificationBell";
export { CommandPalette, filterSections } from "./components/CommandPalette";
export type {
  CommandPaletteProps,
  CommandPaletteLabels,
  CommandSection,
  CommandItem,
} from "./components/CommandPalette";

// ── Hooks ───────────────────────────────────────────────────────────────────
export {
  useClickOutside,
  useElapsedSince,
  useDialogA11y,
  useGlobalHotkey,
  useReducedMotion,
} from "./hooks";
export type { UseDialogA11yOptions, UseGlobalHotkeyOptions } from "./hooks";

// ── Lib ─────────────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";
export { getStatusStyle, statusStyles } from "./lib/statusStyles";
export type { StatusStyle } from "./lib/statusStyles";
export {
  applyColumnPrefs,
  defaultHiddenAccessors,
  resolveHiddenAccessors,
} from "./lib/applyColumnPrefs";
export {
  pickHorizontalAnchor,
  horizontalAnchorFor,
  fixedPopoverPosition,
} from "./lib/popoverAlign";
export type { Anchor, FixedPopoverPosition } from "./lib/popoverAlign";
export { normalize } from "./lib/normalize";
export {
  formatDate,
  formatDecimal,
  formatRelativeTime,
  formatCompact,
  formatDateIntl,
  formatDateRangeIntl,
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
