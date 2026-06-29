import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export interface SearchTriggerLabels {
  /** Pill text on desktop. */
  trigger: string;
  /** Accessible label for both the pill and the mobile icon button. */
  triggerAria: string;
  /** Keyboard shortcut badge (e.g. "⌘K"). */
  shortcut: string;
}

export interface SearchTriggerProps {
  /** Open the search / command palette. */
  onOpen: () => void;
  labels?: Partial<SearchTriggerLabels>;
}

const DEFAULT_LABELS: SearchTriggerLabels = {
  trigger: "Search…",
  triggerAria: "Open search",
  shortcut: "⌘K",
};

/**
 * Opens a search / command palette. Renders as a "Search… ⌘K" pill on desktop
 * and a compact icon button on mobile. Purely presentational — wire `onOpen` to
 * your palette.
 */
export const SearchTrigger = ({ onOpen, labels }: SearchTriggerProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <>
      {/* Desktop: pill */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={l.triggerAria}
        className="focus-visible:ring-primary-blue-light hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-500 focus-visible:ring-2 focus-visible:outline-none md:flex dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-400"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[13px]" />
        <span>{l.trigger}</span>
        <kbd className="ml-6 rounded border border-gray-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {l.shortcut}
        </kbd>
      </button>

      {/* Mobile: icon button */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={l.triggerAria}
        className="focus-visible:ring-primary-blue-light inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:outline-none md:hidden dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
      </button>
    </>
  );
};

export default SearchTrigger;
