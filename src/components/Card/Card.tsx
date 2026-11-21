import { isValidElement, type ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../lib/utils";

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  /** A FontAwesome icon, or any node (e.g. an `<img>` or a custom glyph). */
  icon?: IconDefinition | ReactNode;
  /** Right-aligned footer row, e.g. `<FormActions/>` or a Save button. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Extra classes for the body (default padding `px-6 py-6`). */
  bodyClassName?: string;
}

const isIconDefinition = (value: unknown): value is IconDefinition =>
  typeof value === "object" &&
  value !== null &&
  !isValidElement(value) &&
  "iconName" in value &&
  "prefix" in value &&
  "icon" in value;

/**
 * Section card: a header with an optional icon tile, title and description;
 * a padded body; and an optional tinted footer for actions. The surface used
 * by settings pages and detail panels.
 */
export const Card = ({
  id,
  title,
  description,
  icon,
  footer,
  children,
  className,
  bodyClassName,
}: CardProps) => (
  <section
    id={id}
    className={cn(
      "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
      className,
    )}
  >
    <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5 dark:border-slate-800">
      {icon !== undefined && icon !== null && icon !== false && (
        <span className="bg-primary-blue-lightest text-primary-blue-default flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs">
          {isIconDefinition(icon) ? <FontAwesomeIcon icon={icon} aria-hidden="true" /> : (icon as ReactNode)}
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{description}</p>
        )}
      </div>
    </div>
    <div className={cn("px-6 py-6", bodyClassName)}>{children}</div>
    {footer && (
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
        {footer}
      </div>
    )}
  </section>
);

export default Card;
