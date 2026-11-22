import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faRocket,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import type { NotificationTone } from "./NotificationBell.types";

export interface NotificationToneStyle {
  icon: IconDefinition;
  /** Tinted icon square (bg + icon color). */
  iconBox: string;
  /** Unread dot color. */
  dot: string;
}

/**
 * Per-tone visuals for a notification row. Status tints are raw palette
 * colors, so each carries its `dark:` counterpart; `release` uses brand tokens,
 * which flip on their own.
 */
export const notificationTones: Record<NotificationTone, NotificationToneStyle> = {
  info: {
    icon: faCircleInfo,
    iconBox: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  success: {
    icon: faCircleCheck,
    iconBox:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warning: {
    icon: faTriangleExclamation,
    iconBox: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  critical: {
    icon: faCircleExclamation,
    iconBox: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300",
    dot: "bg-red-500",
  },
  release: {
    icon: faRocket,
    iconBox: "bg-primary-blue-lightest text-primary-blue-default",
    dot: "bg-primary-blue-default",
  },
};

/** The look of a row without a `tone`: the brand-blue bell (the pre-tone default). */
export const DEFAULT_NOTIFICATION_STYLE: NotificationToneStyle = {
  icon: faBell,
  iconBox: "bg-primary-blue-lightest text-primary-blue-default",
  dot: "bg-primary-blue-default",
};

export const getNotificationToneStyle = (
  tone?: NotificationTone,
): NotificationToneStyle =>
  (tone && notificationTones[tone]) || DEFAULT_NOTIFICATION_STYLE;
