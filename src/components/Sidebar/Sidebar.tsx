import type { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";
import { isPathActive, type SidebarLabels, type SidebarProps } from "./Sidebar.types";

const DEFAULT_LABELS: SidebarLabels = {
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  closeMobile: "Close menu",
};

const mergeLabels = (labels?: Partial<SidebarLabels>): SidebarLabels => ({
  ...DEFAULT_LABELS,
  ...labels,
});

/**
 * Controlled, presentational application sidebar: a brand header, a collapse /
 * mobile-close control, grouped navigation, and an optional footer slot (e.g.
 * `<CompanySwitcher/>`) plus a version line.
 *
 * Navigation is decoupled from any router: items render `<a href>` and call
 * `onNavigate(path)` on click; the active item is computed from `activePath`.
 * Permission/visibility filtering is the consumer's job — pass pre-filtered
 * `groups`.
 */
export const Sidebar = ({
  groups,
  activePath,
  onNavigate,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onMobileClose,
  logo,
  appName = "App",
  homePath = "/",
  version,
  footer,
  labels,
  className,
}: SidebarProps) => {
  const l = mergeLabels(labels);

  const handleNav = (e: MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-200 ease-in-out lg:static lg:z-auto dark:border-slate-800 dark:bg-slate-900",
          isCollapsed ? "lg:w-[72px]" : "lg:w-60",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4 dark:border-slate-800",
            isCollapsed && "lg:justify-center lg:px-0",
          )}
        >
          <a
            href={homePath}
            onClick={(e) => handleNav(e, homePath)}
            className={cn(
              "flex min-w-0 cursor-pointer items-center gap-2",
              isCollapsed && "lg:justify-center",
            )}
          >
            {logo ?? (
              <span className="text-primary-blue-darker truncate text-[14px] font-bold">
                {appName}
              </span>
            )}
          </a>

          {/* Collapse button — desktop only, visible when expanded */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden h-6 w-6 place-items-center rounded bg-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:grid dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label={l.collapse}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
            </button>
          )}

          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="grid h-6 w-6 place-items-center rounded bg-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={l.closeMobile}
          >
            <FontAwesomeIcon icon={faTimes} className="text-[12px]" />
          </button>
        </div>

        {/* Expand button — desktop only, visible when collapsed */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="mx-auto mt-2 hidden h-7 w-7 place-items-center rounded bg-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:grid dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={l.expand}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {groups.map((group, gi) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.key} className="mb-3">
                {/* Group label + divider — only when expanded */}
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 pt-3 pb-1.5",
                    isCollapsed && "lg:hidden",
                  )}
                >
                  <span className="text-primary-blue-default shrink-0 text-[10px] font-bold tracking-[0.08em] uppercase">
                    {group.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gray-100 dark:bg-slate-800"
                  />
                </div>

                {/* Group divider — only when collapsed (skip first) */}
                {gi > 0 && (
                  <div
                    className={cn(
                      "mx-3 my-2 hidden border-t border-gray-100 dark:border-slate-800",
                      isCollapsed && "lg:block",
                    )}
                  />
                )}

                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = isPathActive(
                      item.path,
                      activePath,
                      item.end,
                    );
                    return (
                      <li key={item.key}>
                        <a
                          href={item.path || "#"}
                          onClick={(e) =>
                            item.path
                              ? handleNav(e, item.path)
                              : e.preventDefault()
                          }
                          title={isCollapsed ? item.label : undefined}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors",
                            isCollapsed && "lg:justify-center lg:px-0",
                            isActive
                              ? "bg-primary-blue-lightest text-primary-blue-default font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                          )}
                        >
                          {isActive && (
                            <span className="bg-primary-blue-default absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full" />
                          )}
                          {item.icon && (
                            <FontAwesomeIcon
                              icon={item.icon}
                              className={cn(
                                "w-4 shrink-0 text-center text-[13px]",
                                isActive
                                  ? "text-primary-blue-default"
                                  : "text-gray-400 dark:text-slate-500",
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "flex-1 truncate text-left",
                              isCollapsed && "lg:hidden",
                            )}
                          >
                            {item.label}
                          </span>
                          {item.badge != null && (
                            <span className={cn(isCollapsed && "lg:hidden")}>
                              {item.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer slot (e.g. company switcher) */}
        {footer && (
          <div className="shrink-0 border-t border-gray-100 p-2 dark:border-slate-800">
            {footer}
          </div>
        )}

        {/* Build version */}
        {version && (
          <div className="shrink-0 border-t border-gray-100 px-3 py-1.5 text-center text-[10px] text-gray-300 select-none dark:border-slate-800 dark:text-slate-600">
            <span className={cn(isCollapsed && "lg:hidden")}>{appName} </span>v
            {version}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
