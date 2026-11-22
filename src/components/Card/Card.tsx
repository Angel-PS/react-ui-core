import { isValidElement, type ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../lib/utils";

export type CardVariant = "default" | "compact";

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  /** A FontAwesome icon, or any node (e.g. an `<img>` or a custom glyph). */
  icon?: IconDefinition | ReactNode;
  /** Right-aligned header slot, e.g. a period selector or a "View all" link. */
  action?: ReactNode;
  /** Right-aligned footer row, e.g. `<FormActions/>` or a Save button. */
  footer?: ReactNode;
  /**
   * `default` — a settings/detail section: header band with a divider, padded
   * body, tinted footer.
   * `compact` — a dashboard tile: one padded surface, small header without a
   * divider, body fills the remaining height.
   */
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  /** Extra classes for the body wrapper. */
  bodyClassName?: string;
}

const isIconDefinition = (value: unknown): value is IconDefinition =>
  typeof value === "object" &&
  value !== null &&
  !isValidElement(value) &&
  "iconName" in value &&
  "prefix" in value &&
  "icon" in value;

const hasIcon = (icon: CardProps["icon"]) =>
  icon !== undefined && icon !== null && icon !== false;

const renderIcon = (icon: CardProps["icon"]) =>
  isIconDefinition(icon) ? (
    <FontAwesomeIcon icon={icon} aria-hidden="true" />
  ) : (
    (icon as ReactNode)
  );

/**
 * Section card: a header with an optional icon tile, title, description and
 * action; a body; and an optional footer for actions.
 *
 * Painted with the semantic tokens (`bg-card`, `border-border`,
 * `text-muted-foreground`, `bg-muted`) rather than raw neutrals, so an app that
 * re-themes those tokens re-themes the card too. Internal dividers use
 * `border-border/60` to stay a step lighter than the outer edge.
 */
export const Card = ({
  id,
  title,
  description,
  icon,
  action,
  footer,
  variant = "default",
  children,
  className,
  bodyClassName,
}: CardProps) => {
  if (variant === "compact") {
    return (
      <section
        id={id}
        className={cn(
          "border-border bg-card text-card-foreground flex flex-col rounded-2xl border p-6 shadow-sm",
          className,
        )}
      >
        <header className="mb-4 flex items-start gap-3">
          {hasIcon(icon) && (
            <span className="bg-primary-blue-lightest text-primary-blue-default flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm">
              {renderIcon(icon)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-foreground text-sm font-semibold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
        <div className={cn("flex flex-1 flex-col", bodyClassName)}>{children}</div>
        {footer && (
          <div className="border-border/60 mt-4 flex items-center justify-end gap-3 border-t pt-4">
            {footer}
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn(
        "border-border bg-card text-card-foreground overflow-hidden rounded-2xl border shadow-sm",
        className,
      )}
    >
      <div className="border-border/60 flex items-start gap-3 border-b px-6 py-5">
        {hasIcon(icon) && (
          <span className="bg-primary-blue-lightest text-primary-blue-default flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs">
            {renderIcon(icon)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn("px-6 py-6", bodyClassName)}>{children}</div>
      {footer && (
        <div className="border-border/60 bg-muted/60 flex items-center justify-end gap-3 border-t px-6 py-4">
          {footer}
        </div>
      )}
    </section>
  );
};

export default Card;
