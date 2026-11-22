import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/** Severity/kind of a notification — picks the row's icon and colors. */
export type NotificationTone =
  | "info"
  | "success"
  | "warning"
  | "critical"
  | "release";

/** A generic notification entry (decoupled from any app's notification model). */
export interface NotificationItem {
  id: string | number;
  title: string;
  body?: string;
  /** Pre-formatted timestamp label — the consumer formats dates. */
  time?: string;
  /** Whether the notification has been read. */
  read?: boolean;
  /**
   * Severity/kind: sets the icon, the icon-box tint and the unread dot color.
   * Omit for the neutral brand-blue bell.
   */
  tone?: NotificationTone;
  /** Overrides the tone's icon. */
  icon?: IconDefinition;
}

export interface NotificationBellLabels {
  label: string;
  title: string;
  markAllRead: string;
  viewAll: string;
  empty: string;
  /** Accessible name of the unread dot on a row. */
  unread: string;
}

export interface NotificationListItemLabels {
  /** Accessible name (and tooltip) of the unread dot. */
  unread: string;
}

export interface NotificationBellProps {
  items: NotificationItem[];
  unreadCount: number;
  /** Fired when a row is clicked. */
  onItemClick: (item: NotificationItem) => void;
  /** Fired by the "mark all as read" button. */
  onMarkAllRead: () => void;
  /** Fired by the "view all" footer button. */
  onViewAll: () => void;
  /** Disable the "mark all" button while a request is in flight. */
  isMarkingAll?: boolean;
  labels?: Partial<NotificationBellLabels>;
}

export interface NotificationListItemProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  labels?: Partial<NotificationListItemLabels>;
}
