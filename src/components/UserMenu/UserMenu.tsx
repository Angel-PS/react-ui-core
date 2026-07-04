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

export interface UserMenuProps {
  fullName: string;
  username: string;
  /** Avatar initials. Defaults to `getInitials(fullName)`. */
  initials?: string;
  /** Menu rows (e.g. Settings, Logout). The consumer wires navigation/logout. */
  items: UserMenuItem[];
  labels?: Partial<UserMenuLabels>;
}

const DEFAULT_LABELS: UserMenuLabels = { userMenu: "User menu" };

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
  labels,
}: UserMenuProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [showMenu, setShowMenu] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setShowMenu(false));
  const avatar = initials ?? getInitials(fullName);

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
        className="focus-visible:ring-primary-blue-light flex cursor-pointer items-center gap-3 rounded-full py-1 pr-1 pl-2 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:outline-none dark:hover:bg-slate-800"
      >
        <span className="hidden text-right sm:block">
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
