import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export type AlertBannerTone = "info" | "warning" | "error";

export interface AlertBannerLabels {
  dismiss: string;
}

export interface AlertBannerProps {
  tone?: AlertBannerTone;
  /** The message body (string or rich content). */
  message: ReactNode;
  /** Optional call-to-action link/button on the right. */
  action?: { label: string; onClick: () => void };
  /** Show a dismiss (×) button. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Override the leading icon (defaults by tone). */
  icon?: IconDefinition;
  labels?: Partial<AlertBannerLabels>;
  className?: string;
}

const DEFAULT_LABELS: AlertBannerLabels = { dismiss: "Dismiss" };

const TONES: Record<AlertBannerTone, { palette: string; icon: IconDefinition }> =
  {
    info: {
      palette:
        "bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200",
      icon: faCircleInfo,
    },
    warning: {
      palette:
        "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200",
      icon: faTriangleExclamation,
    },
    error: {
      palette:
        "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200",
      icon: faTriangleExclamation,
    },
  };

/**
 * Generic app-wide notice bar (generalized from the BluePOS subscription
 * banner). Presentational: the consumer decides when to show it and what the
 * message/action are. Renders a full-width strip with a tone-tinted palette, a
 * leading icon, an optional CTA, and an optional dismiss button.
 */
export const AlertBanner = ({
  tone = "info",
  message,
  action,
  dismissible,
  onDismiss,
  icon,
  labels,
  className,
}: AlertBannerProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const { palette, icon: defaultIcon } = TONES[tone];

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 border-b px-4 py-2.5 text-sm lg:px-8",
        palette,
        className,
      )}
    >
      <FontAwesomeIcon
        icon={icon ?? defaultIcon}
        aria-hidden="true"
        className="shrink-0"
      />
      <p className="flex-1 leading-snug">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 bg-transparent font-semibold underline-offset-2 hover:underline"
        >
          {action.label}
          <FontAwesomeIcon
            icon={faArrowRight}
            aria-hidden="true"
            className="text-xs"
          />
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={l.dismiss}
          className="shrink-0 cursor-pointer rounded bg-transparent p-1 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
