import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../lib/utils";

export interface EmptyStateProps {
  icon?: IconDefinition;
  title: string;
  description?: string;
  /** Optional call to action (e.g. a `<Button>`). */
  action?: ReactNode;
  /** `md` for a page/section, `sm` for a card or popover. */
  size?: "md" | "sm";
  className?: string;
}

/**
 * Calm "nothing here yet" panel on a recessed surface. `role="status"` so a
 * list that empties after a filter is announced politely.
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  size = "md",
  className,
}: EmptyStateProps) => (
  <div
    role="status"
    className={cn(
      "flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 text-center dark:border-slate-700 dark:bg-slate-800",
      size === "md" ? "px-6 py-10" : "px-4 py-8",
      className,
    )}
  >
    {icon && (
      <FontAwesomeIcon
        icon={icon}
        aria-hidden="true"
        className={cn(
          "text-gray-300 dark:text-slate-600",
          size === "md" ? "text-3xl" : "text-2xl",
        )}
      />
    )}
    <p
      className={cn(
        "font-semibold text-gray-700 dark:text-slate-300",
        size === "md" ? "text-sm" : "text-[.8125rem]",
      )}
    >
      {title}
    </p>
    {description && (
      <p className="max-w-[28ch] text-xs leading-relaxed text-gray-500 dark:text-slate-400">
        {description}
      </p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
