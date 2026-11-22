import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { ReactNode } from "react";

/** A single navigation entry within a sidebar group. */
export interface SidebarItem {
  /** Stable unique key. */
  key: string;
  /** Display label (already translated by the consumer). */
  label: string;
  /** FontAwesome icon shown beside the label. */
  icon?: IconDefinition;
  /** Destination path passed to `onNavigate`. */
  path?: string;
  /**
   * Match the active state by exact path only (mirrors react-router's `end`).
   * Defaults to a segment-boundary prefix match.
   */
  end?: boolean;
  /** Optional trailing badge (count, "new", …). */
  badge?: ReactNode;
}

/** A labelled group of navigation items. */
export interface SidebarGroup {
  /** Stable unique key. */
  key: string;
  /** Section heading (already translated by the consumer). */
  title: string;
  items: SidebarItem[];
}

/** A company/tenant shown in the footer switcher. */
export interface CompanyOption {
  id: string | number;
  /** Primary line (trade name). */
  primaryLabel: string;
  /** Secondary line (legal name / RNC). */
  secondaryLabel?: string;
}

export interface SidebarLabels {
  collapse: string;
  expand: string;
  closeMobile: string;
}

export interface CompanySwitcherLabels {
  switchCompany: string;
  yourCompanies: string;
  /** Primary line when no company is active but one can be picked. */
  noCompany: string;
  /** Primary line when no company is active and there is nothing to pick. */
  noCompanyAvailable: string;
  /**
   * Secondary line when no company is active (e.g. "Platform only" for an
   * operator who deliberately works without a tenant). Default: empty.
   */
  noCompanyHint: string;
}

export interface SidebarProps {
  /**
   * Navigation groups, **already filtered** by the consumer (permissions,
   * super-admin, feature flags). The library renders exactly what it's given.
   */
  groups: SidebarGroup[];
  /** Current route path, used to compute the active item. */
  activePath: string;
  /** Called with an item's `path` when it's clicked (replaces router navigation). */
  onNavigate: (path: string) => void;

  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;

  /**
   * Custom brand node for the header (clickable area). When set it replaces the
   * default brand entirely (`brandIcon` + `appName`), so it must handle the
   * collapsed rail itself.
   */
  logo?: ReactNode;
  /**
   * Icon/image rendered before `appName` in the default brand. The name hides on
   * the collapsed desktop rail, leaving only this icon. Ignored when `logo` is set.
   */
  brandIcon?: ReactNode;
  /** App name shown as the brand text and version prefix. */
  appName?: string;
  /** Path navigated to when the brand is clicked. Default `/`. */
  homePath?: string;
  /** Build/app version shown in the footer (was `__APP_VERSION__`). */
  version?: string;
  /** Footer slot rendered above the version line (e.g. `<CompanySwitcher/>`). */
  footer?: ReactNode;
  /**
   * Render pulsing placeholder rows instead of `groups` — use while the consumer
   * is still resolving what the user may see (e.g. permissions in flight), so
   * the menu does not flash empty and then pop in.
   */
  loading?: boolean;
  /** Number of placeholder rows while `loading`. Default 8. */
  skeletonCount?: number;
  labels?: Partial<SidebarLabels>;
  className?: string;
}

export interface CompanySwitcherProps {
  activeCompany?: CompanyOption | null;
  companies: CompanyOption[];
  /**
   * Whether switching is allowed. Defaults to "there is another company to
   * pick": `companies.length > 1` with an active company, `> 0` without one.
   */
  canSwitch?: boolean;
  onSelectCompany: (id: string | number) => void;
  isCollapsed?: boolean;
  /**
   * Show a skeleton instead of the company row — use while the active company /
   * profile is still loading, rather than flashing a placeholder name.
   */
  loading?: boolean;
  labels?: Partial<CompanySwitcherLabels>;
}

/**
 * Is `itemPath` the active route given `activePath`? Exact when `end`, otherwise
 * a segment-boundary prefix match (mirrors react-router's NavLink semantics).
 */
export function isPathActive(
  itemPath: string | undefined,
  activePath: string,
  end?: boolean,
): boolean {
  if (!itemPath) return false;
  if (end) return activePath === itemPath;
  return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
}
