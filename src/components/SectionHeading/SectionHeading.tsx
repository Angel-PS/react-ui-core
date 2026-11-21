import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../lib/utils";

export interface SectionHeadingProps {
  /** Icon drawn in the brand-gradient chip. */
  icon: IconDefinition;
  /** Section title — rendered uppercase with wide tracking. */
  title: string;
  className?: string;
}

/**
 * Divider-style heading for a group of form fields or a card section:
 * a brand-gradient icon chip, an uppercase title and a hairline rule that
 * fills the rest of the row.
 */
export const SectionHeading = ({ icon, title, className }: SectionHeadingProps) => (
  <div className={cn("mb-4 flex items-center gap-2.5", className)}>
    <div className="from-primary-blue-default to-primary-blue-dark flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm">
      <FontAwesomeIcon icon={icon} className="text-[11px]" aria-hidden="true" />
    </div>
    <span className="text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-slate-300">
      {title}
    </span>
    <div aria-hidden="true" className="ml-1 h-px flex-1 bg-gray-200 dark:bg-slate-700" />
  </div>
);

export default SectionHeading;
