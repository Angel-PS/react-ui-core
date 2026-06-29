import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "../../hooks";
import { Button } from "../Button";
import { NotificationListItem } from "./NotificationListItem";
import type {
  NotificationBellLabels,
  NotificationBellProps,
} from "./NotificationBell.types";

const DEFAULT_LABELS: NotificationBellLabels = {
  label: "Notifications",
  title: "Notifications",
  markAllRead: "Mark all as read",
  viewAll: "View all",
  empty: "You're all caught up",
};

/**
 * Navbar notification bell with an unread badge and a dropdown panel. Controlled
 * and presentational: pass `items` / `unreadCount` and handle the callbacks
 * (`onItemClick`, `onMarkAllRead`, `onViewAll`). Data fetching/mutations stay in
 * the app.
 */
export const NotificationBell = ({
  items,
  unreadCount,
  onItemClick,
  onMarkAllRead,
  onViewAll,
  isMarkingAll,
  labels,
}: NotificationBellProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [showPanel, setShowPanel] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setShowPanel(false));
  const badge = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setShowPanel((open) => !open)}
        className="hover:text-primary-blue-default focus-visible:ring-primary-blue-light relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-transparent text-gray-400 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:outline-none dark:text-slate-500 dark:hover:bg-slate-800"
        aria-label={l.label}
      >
        <FontAwesomeIcon icon={faBell} className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {badge}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="animate-fadeIn absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 sm:w-96 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              {l.title}
            </p>
            {unreadCount > 0 && (
              <Button
                variant="inactive-filter"
                className="text-primary-blue-default hover:text-primary-blue-dark px-0 py-0 text-xs font-medium"
                onClick={onMarkAllRead}
                disabled={isMarkingAll}
              >
                {l.markAllRead}
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-1.5">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                {l.empty}
              </p>
            ) : (
              items.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  onClick={onItemClick}
                />
              ))
            )}
          </div>

          <div className="border-t border-gray-100 p-2 dark:border-slate-800">
            <Button
              variant="inactive-filter"
              className="text-primary-blue-default hover:text-primary-blue-dark w-full text-center text-xs font-semibold"
              onClick={() => {
                setShowPanel(false);
                onViewAll();
              }}
            >
              {l.viewAll}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
