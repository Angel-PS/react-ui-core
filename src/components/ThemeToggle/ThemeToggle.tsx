import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export interface ThemeToggleLabels {
  toggleToLight: string;
  toggleToDark: string;
}

export interface ThemeToggleProps {
  /** Whether dark mode is currently active. */
  isDark: boolean;
  /** Called when the user clicks the toggle. The consumer flips the theme. */
  onToggle: () => void;
  labels?: Partial<ThemeToggleLabels>;
  className?: string;
}

const DEFAULT_LABELS: ThemeToggleLabels = {
  toggleToLight: "Switch to light mode",
  toggleToDark: "Switch to dark mode",
};

/**
 * Presentational light/dark switch for the navbar. Controlled: the library does
 * not own the theme — pass `isDark` and handle `onToggle` (write the cookie,
 * flip `.dark` on `<html>`, etc.).
 */
export const ThemeToggle = ({
  isDark,
  onToggle,
  labels,
  className,
}: ThemeToggleProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const label = isDark ? l.toggleToLight : l.toggleToDark;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={
        className ??
        "focus-visible:ring-primary-blue-light inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      }
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-lg" />
    </button>
  );
};

export default ThemeToggle;
