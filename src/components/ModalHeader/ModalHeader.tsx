import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export interface ModalHeaderLabels {
  /** Accessible name of the close button. */
  close: string;
  /** Formats the record id shown before the subtitle in edit mode. */
  id: (id: number | string) => string;
}

export const DEFAULT_MODAL_HEADER_LABELS: ModalHeaderLabels = {
  close: "Close",
  id: (id) => `ID #${id}`,
};

export interface ModalHeaderProps {
  /** Edit mode — shows `title` and prefixes the subtitle with the record id. */
  isEdit: boolean;
  /** Record id, shown as `labels.id(id)` in edit mode. */
  id?: number | string;
  /** Heading in edit mode. */
  title: string;
  /** Heading in create mode. */
  createTitle: string;
  subtitle: string;
  icon: IconDefinition;
  onClose: () => void;
  /**
   * `id` of the `<h2>` — pass the same value to a dialog's `aria-labelledby`
   * so the dialog is announced by its heading.
   */
  headingId?: string;
  className?: string;
  labels?: Partial<ModalHeaderLabels>;
}

/**
 * Header for a create/edit modal: an icon tile, the title (create or edit
 * variant), a subtitle that carries the record id in edit mode, and a close
 * button. Designed for `Modal`'s `headerContent` slot.
 */
export const ModalHeader = ({
  isEdit,
  id,
  title,
  createTitle,
  subtitle,
  icon,
  onClose,
  headingId,
  className,
  labels,
}: ModalHeaderProps) => {
  const l = { ...DEFAULT_MODAL_HEADER_LABELS, ...labels };
  const showId = isEdit && id !== undefined && id !== null && id !== "";
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-gray-100 px-6 py-5 dark:border-slate-800",
        className,
      )}
    >
      <div className="bg-primary-blue-lightest flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
        <FontAwesomeIcon icon={icon} aria-hidden="true" className="text-primary-blue-default text-base" />
      </div>

      <div className="min-w-0 flex-1">
        <h2
          id={headingId}
          className="text-base leading-tight font-bold text-gray-900 dark:text-slate-100"
        >
          {isEdit ? title : createTitle}
        </h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
          {showId ? `${l.id(id as number | string)} · ${subtitle}` : subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={l.close}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ModalHeader;
