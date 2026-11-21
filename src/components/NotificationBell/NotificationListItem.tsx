import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../lib/utils";
import type {
  NotificationListItemLabels,
  NotificationListItemProps,
} from "./NotificationBell.types";
import { getNotificationToneStyle } from "./notificationTones";

const DEFAULT_LABELS: NotificationListItemLabels = { unread: "Unread" };

/**
 * A single row inside the notification panel. Unread rows get a tinted
 * background, a bolder title and a dot; `notification.tone` picks the icon and
 * colors. Presentational — clicking calls `onClick(notification)`.
 */
export const NotificationListItem = ({
  notification,
  onClick,
  labels,
}: NotificationListItemProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const unread = !notification.read;
  const tone = getNotificationToneStyle(notification.tone);
  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800",
        unread && "bg-primary-blue-lightest/60",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px]",
          tone.iconBox,
        )}
      >
        <FontAwesomeIcon icon={notification.icon ?? tone.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "block flex-1 truncate text-[13px] text-gray-800 dark:text-slate-100",
              unread ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </span>
          {unread && (
            <span
              role="img"
              title={l.unread}
              aria-label={l.unread}
              className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", tone.dot)}
            />
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
