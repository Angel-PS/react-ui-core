import { useState } from "react";
import { useClickOutside } from "../../hooks";
import { getInitials } from "../../lib/format";
import { cn } from "../../lib/utils";

export interface UserMenuItem {
  key: string;
  label: string;
  onClick: () => void;
  /** "danger" renders the row in red (e.g. logout). */
  variant?: "default" | "danger";
}

export interface UserMenuLabels {
  userMenu: string;
}

/** Breakpoint from which the name + username show next to the avatar. */
export type UserMenuNameBreakpoint = "sm" | "md" | "lg" | "xl";

export interface UserMenuProps {
  fullName: string;
  username: string;
  /** Avatar initials. Defaults to `getInitials(fullName)`. */
  initials?: string;
  /** Menu rows (e.g. Settings, Logout). The consumer wires navigation/logout. */
  items: UserMenuItem[];
  /**
   * Show a skeleton while the profile loads, instead of rendering a fallback
   * name (e.g. "Unknown Unknown") that then flips to the real one.
   */
  loading?: boolean;
  /**
   * From which breakpoint the name + username show beside the avatar. Below it
   * only the avatar stays (the button's aria-label still names the menu).
   * Default `"sm"`. Use `"xl"` when the navbar is crowded at tablet widths.
   */
  nameBreakpoint?: UserMenuNameBreakpoint;
  labels?: Partial<UserMenuLabels>;
}

const DEFAULT_LABELS: UserMenuLabels = { userMenu: "User menu" };

// Literal class strings — Tailwind v4 only emits classes it can see verbatim.
const NAME_VISIBLE: Record<UserMenuNameBreakpoint, string> = {
  sm: "hidden text-right sm:block",
  md: "hidden text-right md:block",
  lg: "hidden text-right lg:block",
  xl: "hidden text-right xl:block",
};
const SKELETON_NAME_VISIBLE: Record<UserMenuNameBreakpoint, string> = {
  sm: "hidden flex-col items-end gap-1.5 py-1 sm:flex",
  md: "hidden flex-col items-end gap-1.5 py-1 md:flex",
  lg: "hidden flex-col items-end gap-1.5 py-1 lg:flex",
  xl: "hidden flex-col items-end gap-1.5 py-1 xl:flex",
};
// The button's left padding only matters next to the name; avatar-only gets a
// symmetric 1.
const BUTTON_PAD_LEFT: Record<UserMenuNameBreakpoint, string> = {
  sm: "pl-1 sm:pl-2",
  md: "pl-1 md:pl-2",
  lg: "pl-1 lg:pl-2",
  xl: "pl-1 xl:pl-2",
};

/**
 * Navbar user/profile menu: avatar + name button that opens a dropdown of
 * actions. Controlled and presentational — pass the user's display data and the
 * menu `items` (their `onClick` handlers own navigation/logout).
 */
export const UserMenu = ({
  fullName,
  username,
  initials,
  items,
  loading = false,
  nameBreakpoint = "sm",
  labels,
}: UserMenuProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [showMenu, setShowMenu] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setShowMenu(false));
  const avatar = initials ?? getInitials(fullName);

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label={l.userMenu}
        className="flex items-center gap-3 border-l border-gray-200 pl-2 md:pl-4 lg:pl-6 dark:border-slate-800"
      >
        <span className={SKELETON_NAME_VISIBLE[nameBreakpoint]}>
          <span className="block h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
          <span className="block h-2.5 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        </span>
        <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 ring-2 ring-white dark:bg-slate-700 dark:ring-slate-900" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex items-center gap-3 border-l border-gray-200 pl-2 md:pl-4 lg:pl-6 dark:border-slate-800"
    >
      <button
        type="button"
        onClick={() => setShowMenu((s) => !s)}
        aria-haspopup="menu"
        aria-expanded={showMenu}
        aria-label={l.userMenu}
        className={cn(
          "focus-visible:ring-primary-blue-light flex cursor-pointer items-center gap-3 rounded-full py-1 pr-1 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:outline-none dark:hover:bg-slate-800",
          BUTTON_PAD_LEFT[nameBreakpoint],
        )}
      >
        <span className={NAME_VISIBLE[nameBreakpoint]}>
          <span className="block truncate text-sm font-semibold text-gray-800 dark:text-slate-100">
            {fullName}
          </span>
          <span className="block text-xs text-gray-400 dark:text-slate-500">
            {username}
          </span>
        </span>
        <span className="bg-primary-blue-default flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
          {avatar}
        </span>
      </button>

      {showMenu && (
        <div
          role="menu"
          className="animate-fadeIn absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
        >
          <div className="p-1.5">
            {items.map((item) => (
              <button
                key={item.key}
                role="menuitem"
                onClick={() => {
                  item.onClick();
                  setShowMenu(false);
                }}
                className={cn(
                  "w-full rounded-lg bg-transparent px-4 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  item.variant === "danger"
                    ? "text-red-600 hover:bg-red-50 focus-visible:ring-red-300 dark:hover:bg-red-950/40"
                    : "focus-visible:ring-primary-blue-light text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
