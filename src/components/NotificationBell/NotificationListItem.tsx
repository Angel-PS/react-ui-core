import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";
import type { NotificationListItemProps } from "./NotificationBell.types";

/**
 * A single row inside the notification panel. Unread rows get a tinted
 * background and a dot. Presentational — clicking calls `onClick(notification)`.
 */
export const NotificationListItem = ({
  notification,
  onClick,
}: NotificationListItemProps) => {
  const unread = !notification.read;
  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800",
        unread && "bg-primary-blue-lightest/60",
      )}
    >
      <span className="bg-primary-blue-lightest text-primary-blue-default mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px]">
        <FontAwesomeIcon icon={notification.icon ?? faBell} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block flex-1 truncate text-[13px] font-semibold text-gray-800 dark:text-slate-100">
            {notification.title}
          </span>
          {unread && (
            <span className="bg-primary-blue-default mt-1 h-2 w-2 shrink-0 rounded-full" />
          )}
        </span>
        {notification.body && (
          <span className="mt-0.5 block line-clamp-2 text-[12px] text-gray-500 dark:text-slate-400">
            {notification.body}
          </span>
        )}
        {notification.time && (
          <span className="mt-1 block text-[11px] text-gray-400 dark:text-slate-500">
            {notification.time}
          </span>
        )}
      </span>
    </button>
  );
};

export default NotificationListItem;
