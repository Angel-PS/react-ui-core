import { useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { useElapsedSince } from "../../hooks";
import { cn } from "../../lib/utils";
import { formatDate, formatRelativeTime } from "../../lib/format";

// ─── Labels ─────────────────────────────────────────────────────────────────

export interface TableFreshnessLabels {
  /** Text on the control (hidden below `sm`, where the icon stands alone). */
  refresh: string;
  /** Accessible name for the control — the icon-only rendering relies on it. */
  ariaLabel: string;
  updated: (when: string) => string;
  justNow: string;
  never: string;
  tooltip: (datetime: string) => string;
  refreshing: string;
  refreshed: string;
}

const DEFAULT_LABELS: TableFreshnessLabels = {
  refresh: "Refresh",
  ariaLabel: "Refresh the table data",
  updated: (when) => `Updated ${when}`,
  justNow: "just now",
  never: "Not loaded yet",
  tooltip: (datetime) => `Last updated: ${datetime}`,
  refreshing: "Refreshing data…",
  refreshed: "Data refreshed",
};

// ─── Props ──────────────────────────────────────────────────────────────────

export interface TableFreshnessBarProps {
  /** Epoch ms of the last successful fetch. Omit while nothing has loaded. */
  updatedAt?: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
  /** Elapsed ms past which the stamp reads as stale. Default 5 minutes. */
  staleAfterMs?: number;
  /** BCP-47 tag for the relative label. Default "en". */
  locale?: string;
  /** IANA zone for the absolute tooltip. Omit for the viewer's own zone. */
  timeZone?: string;
  labels?: Partial<TableFreshnessLabels>;
}

const DEFAULT_STALE_AFTER_MS = 5 * 60 * 1000;

/** Under a minute, "43 seconds ago" is noise — say "just now". */
const A_MINUTE_MS = 60_000;

/**
 * Slim strip for the top of a table card: when the rows on screen were last
 * fetched, plus the control that fetches them again. Pass it to `<Table>`'s
 * `toolbar` slot so it sits above the column headers, mirroring the
 * `<Pagination>` footer at the bottom of the same card.
 */
export const TableFreshnessBar: FC<TableFreshnessBarProps> = ({
  updatedAt,
  onRefresh,
  isRefreshing = false,
  staleAfterMs = DEFAULT_STALE_AFTER_MS,
  locale = "en",
  timeZone,
  labels,
}) => {
  const l: TableFreshnessLabels = { ...DEFAULT_LABELS, ...labels };
  const elapsed = useElapsedSince(updatedAt);

  // Announce the round trip: the visual cues (spinning icon, dimmed rows) say
  // nothing on their own. Derived by adjusting state during render — React's
  // documented way to react to a changed prop — rather than in an effect, which
  // would cost an extra commit per transition.
  const [announcement, setAnnouncement] = useState({
    busy: false,
    message: "",
  });
  if (announcement.busy !== isRefreshing) {
    setAnnouncement({
      busy: isRefreshing,
      message: isRefreshing ? l.refreshing : l.refreshed,
    });
  }

  const hasLoaded = elapsed !== null && updatedAt !== undefined;
  const isStale = hasLoaded && elapsed >= staleAfterMs;

  // `updatedAt + elapsed` reconstructs "now" out of state, so the label moves
  // on every tick instead of being memoized against an unchanging `updatedAt`.
  const relative = !hasLoaded
    ? ""
    : elapsed < A_MINUTE_MS
      ? l.justNow
      : formatRelativeTime(updatedAt, updatedAt + elapsed, locale);

  const stamp = hasLoaded ? l.updated(relative) : l.never;
  const tooltip = hasLoaded
    ? l.tooltip(formatDate(new Date(updatedAt), "DD-MM-YYYY", true, timeZone))
    : undefined;

  const dotClass = !hasLoaded
    ? "bg-gray-300 dark:bg-slate-600"
    : isStale
      ? "bg-accent-amber"
      : "bg-emerald-500";

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-gray-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
      <span
        title={tooltip}
        className="flex min-w-0 items-center gap-2 text-xs text-gray-500 dark:text-slate-400"
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200",
            dotClass,
            isRefreshing && "animate-pulse motion-reduce:animate-none",
          )}
        />
        <span className="truncate">{stamp}</span>
      </span>

      <Button
        type="button"
        variant="toolbar-button"
        onClick={onRefresh}
        disabled={isRefreshing}
        title={l.refresh}
        aria-label={tooltip ? `${l.ariaLabel}. ${tooltip}` : l.ariaLabel}
        className="focus-visible:ring-primary-blue-light inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 px-2.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default"
      >
        <FontAwesomeIcon
          icon={faArrowsRotate}
          aria-hidden="true"
          className={cn(
            "text-xs",
            isRefreshing && "animate-spin motion-reduce:animate-none",
          )}
        />
        <span className="hidden sm:inline">{l.refresh}</span>
      </Button>

      <span aria-live="polite" className="sr-only">
        {announcement.message}
      </span>
    </div>
  );
};

export default TableFreshnessBar;
