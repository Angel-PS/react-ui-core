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
  /**
   * `inset` (default) draws the recessed surface; `plain` draws only the
   * content, for use inside a card that already provides the surface.
   */
  variant?: "inset" | "plain";
  className?: string;
}

/**
 * Calm "nothing here yet" panel. `role="status"` so a list that empties after
 * a filter is announced politely. Painted with the semantic tokens (`bg-muted`,
 * `border-border`, `text-muted-foreground`) so a re-themed app re-themes it.
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  size = "md",
  variant = "inset",
  className,
}: EmptyStateProps) => (
  <div
    role="status"
    className={cn(
      "flex flex-col items-center justify-center gap-2 text-center",
      variant === "inset" && "border-border/60 bg-muted rounded-xl border",
      size === "md" ? "px-6 py-10" : "px-4 py-8",
      className,
    )}
  >
    {icon && (
      <FontAwesomeIcon
        icon={icon}
        aria-hidden="true"
        className={cn(
          "text-muted-foreground/50",
          size === "md" ? "text-3xl" : "text-2xl",
        )}
      />
    )}
    <p
      className={cn(
        "text-foreground/80 font-semibold",
        size === "md" ? "text-sm" : "text-[.8125rem]",
      )}
    >
      {title}
    </p>
    {description && (
      <p className="text-muted-foreground max-w-[28ch] text-xs leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
