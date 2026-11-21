import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface SettingRowProps {
  title: string;
  description?: string;
  /** `id` of the control in `children`, so clicking the title focuses it. */
  htmlFor?: string;
  /** Let the control keep its natural width (a Switch) instead of `sm:w-64`. */
  compact?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * One setting inside a `Card`: title + description on the left, the control
 * on the right (stacked on phones). The `<label>` overrides the library's
 * global `label` base styles (`mb-1`, semibold, gray-700) with the row's own.
 */
export const SettingRow = ({
  title,
  description,
  htmlFor,
  compact = false,
  children,
  className,
}: SettingRowProps) => (
  <div
    className={cn(
      "flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
      className,
    )}
  >
    <div className="min-w-0 sm:flex-1">
      <label
        htmlFor={htmlFor}
        className="mb-0 block text-sm font-medium text-gray-800 dark:text-slate-100"
      >
        {title}
      </label>
      {description && (
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
    <div className={compact ? "shrink-0" : "w-full shrink-0 sm:w-64"}>{children}</div>
  </div>
);

export default SettingRow;
