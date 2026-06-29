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

  /** Custom brand node for the header (clickable area). Falls back to `appName`. */
  logo?: ReactNode;
  /** App name shown as the brand text and version prefix. */
  appName?: string;
  /** Path navigated to when the brand is clicked. Default `/`. */
  homePath?: string;
  /** Build/app version shown in the footer (was `__APP_VERSION__`). */
  version?: string;
  /** Footer slot rendered above the version line (e.g. `<CompanySwitcher/>`). */
  footer?: ReactNode;
  labels?: Partial<SidebarLabels>;
  className?: string;
}

export interface CompanySwitcherProps {
  activeCompany?: CompanyOption | null;
  companies: CompanyOption[];
  /** Whether switching is allowed. Defaults to `companies.length > 1`. */
  canSwitch?: boolean;
  onSelectCompany: (id: string | number) => void;
  isCollapsed?: boolean;
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
