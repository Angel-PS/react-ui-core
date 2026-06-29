import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/** State the shell hands to the `sidebar` slot so it stays in sync. */
export interface SidebarSlotState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

/** State the shell hands to the `navbar` slot. */
export interface NavbarSlotState {
  onMenuClick: () => void;
}

export interface AppLayoutProps {
  /**
   * Sidebar render-prop. Receives the shell's collapse/mobile state — forward it
   * to `<Sidebar/>`'s matching props.
   */
  sidebar: (state: SidebarSlotState) => ReactNode;
  /** Navbar render-prop. Receives `onMenuClick` to open the mobile drawer. */
  navbar?: (state: NavbarSlotState) => ReactNode;
  /** Breadcrumb bar rendered under the navbar (e.g. `<Breadcrumbs/>`). */
  breadcrumbs?: ReactNode;
  /** Full-width notice rendered under the breadcrumbs (e.g. `<AlertBanner/>`). */
  banner?: ReactNode;
  /** Page content (replaces react-router's `<Outlet/>`). */
  children: ReactNode;
  /** Show/hide the header (navbar + breadcrumbs). `"mobile-only"` hides it on lg+. */
  showHeader?: boolean | "mobile-only";
  /** Extra classes for the scrollable `<main>`. */
  className?: string;
}

/**
 * Application shell that composes a sidebar, navbar, breadcrumbs, banner, and a
 * scrollable content area — the framework-agnostic equivalent of the BluePOS
 * `MainLayout`. It owns the sidebar collapse/mobile state and hands it to the
 * `sidebar`/`navbar` slots, so the consumer just plugs in the prop-driven
 * pieces. Routing is the consumer's concern: render the matched page as
 * `children`.
 */
export const AppLayout = ({
  sidebar,
  navbar,
  breadcrumbs,
  banner,
  children,
  showHeader = true,
  className,
}: AppLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const headerVisible = showHeader !== false;
  const mobileOnly = showHeader === "mobile-only";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {sidebar({
        isCollapsed,
        isMobileOpen,
        onToggleCollapse: () => setIsCollapsed((c) => !c),
        onMobileClose: () => setIsMobileOpen(false),
      })}

      <div className="flex flex-1 flex-col overflow-hidden">
        {headerVisible && navbar && (
          <header className={cn("shrink-0", mobileOnly && "lg:hidden")}>
            {navbar({ onMenuClick: () => setIsMobileOpen(true) })}
          </header>
        )}

        {headerVisible && breadcrumbs && (
          <div className={cn(mobileOnly && "lg:hidden")}>{breadcrumbs}</div>
        )}

        {banner}

        <main className={cn("flex-1 overflow-auto p-4 lg:px-8 lg:py-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
