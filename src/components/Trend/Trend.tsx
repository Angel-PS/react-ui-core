import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendDown,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export interface TrendLabels {
  /** Suffix after the percentage, e.g. "vs previous". */
  vsPrevious: string;
  /**
   * Accessible name of the dash shown when there is no previous period. It is
   * read by screen readers and shown as a tooltip — a bare "—" says nothing.
   */
  noBaseline: string;
}

export interface TrendProps {
  /**
   * Percentage change (12.4 = +12.4%). `null`, `undefined` or a non-finite
   * number (no previous period to compare with) renders a neutral dash.
   */
  value: number | null | undefined;
  /** Show the "vs previous" suffix. */
  showVs?: boolean;
  /** Fraction digits of the percentage. */
  decimals?: number;
  /**
   * `auto` (default) colors the chip green/red/neutral. `inherit` drops every
   * color class so the chip takes its color from `className` or its parent —
   * for chips on a brand or image surface where green/red would clash.
   */
  tone?: "auto" | "inherit";
  labels?: Partial<TrendLabels>;
  className?: string;
}

const DEFAULT_LABELS: TrendLabels = {
  vsPrevious: "vs previous",
  noBaseline: "No previous period to compare with",
};

const base =
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums";

/**
 * Period-over-period change chip for KPI cards. Green when the value is zero
 * or up, red when down.
 *
 * Colors are the 700 shades (400 in dark mode), not the brand-dashboard 600s:
 * 10.5px text needs 4.5:1, which emerald/red-600 on their own tint miss.
 */
export const Trend = ({
  value,
  showVs = true,
  decimals = 1,
  tone = "auto",
  labels,
  className,
}: TrendProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const colored = tone === "auto";

  if (value === null || value === undefined || !Number.isFinite(value)) {
    return (
      <span
        title={l.noBaseline}
        className={cn(
          base,
          colored && "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400",
          className,
        )}
      >
        <span aria-hidden="true">—</span>
        <span className="sr-only">{l.noBaseline}</span>
      </span>
    );
  }

  const positive = value >= 0;
  return (
    <span
      data-trend={positive ? "up" : "down"}
      className={cn(
        base,
        colored &&
          (positive
            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
            : "bg-red-500/10 text-red-700 dark:text-red-400"),
        className,
      )}
    >
      <FontAwesomeIcon
        icon={positive ? faArrowTrendUp : faArrowTrendDown}
        aria-hidden="true"
        className="text-[8px]"
      />
      {positive ? "+" : ""}
      {value.toFixed(decimals)}%
      {showVs && (
        <span className="ml-0.5 font-normal opacity-60">{l.vsPrevious}</span>
      )}
    </span>
  );
};

export default Trend;
