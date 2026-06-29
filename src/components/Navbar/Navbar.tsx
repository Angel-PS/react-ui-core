import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export interface NavbarLabels {
  openMenu: string;
}

export interface NavbarProps {
  /** Page title shown on the left. */
  title: ReactNode;
  /** Opens the mobile sidebar drawer (the hamburger button). */
  onMenuClick: () => void;
  /** Right-aligned action cluster — compose the navbar widgets here. */
  actions?: ReactNode;
  /**
   * Overlay content rendered as a sibling of the bar (e.g. a mounted
   * `<CommandPalette/>`), so it isn't clipped by the sticky header.
   */
  children?: ReactNode;
  labels?: Partial<NavbarLabels>;
}

const DEFAULT_LABELS: NavbarLabels = { openMenu: "Open menu" };

/**
 * Top navigation bar shell: a hamburger (mobile) + page title on the left and a
 * consumer-composed `actions` slot on the right. It carries no app state — drop
 * the library's navbar widgets (`SearchTrigger`, `NotificationBell`,
 * `ThemeToggle`, `LanguageSwitcher`, `NewActionMenu`, `UserMenu`) into `actions`.
 */
export const Navbar = ({
  title,
  onMenuClick,
  actions,
  children,
  labels,
}: NavbarProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <>
      <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md transition-all lg:px-8 dark:border-slate-800 dark:bg-slate-900/85">
        {/* Left: mobile menu button + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="focus-visible:ring-primary-blue-light inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:outline-none lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label={l.openMenu}
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
          <h1 className="text-base leading-tight font-bold tracking-tight text-gray-900 dark:text-slate-100">
            {title}
          </h1>
        </div>

        {/* Right: actions */}
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3">{actions}</div>
        )}
      </nav>

      {children}
    </>
  );
};

export default Navbar;
