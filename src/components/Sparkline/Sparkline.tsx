import { useId } from "react";
import { sparklinePath } from "./sparklinePath";

export interface SparklineProps {
  /** Series to plot, oldest first. Non-finite values are ignored. */
  data: readonly number[];
  /** Stroke (and fill gradient) color. Any CSS color, incl. `var(--…)`. */
  color?: string;
  /** Draw the soft gradient under the line. */
  fill?: boolean;
  width?: number;
  height?: number;
  /**
   * When set, the chart is announced as an image with this name. Without it the
   * sparkline is decorative (`aria-hidden`) — put the number it illustrates in
   * text next to it.
   */
  ariaLabel?: string;
  className?: string;
}

/**
 * Tiny dependency-free SVG trend line for KPI cards. Renders nothing for an
 * empty series. The gradient id comes from `useId`, so several sparklines on a
 * page never share (and steal) each other's fill.
 */
export const Sparkline = ({
  data,
  color = "var(--color-primary-blue-default)",
  fill = true,
  width = 100,
  height = 36,
  ariaLabel,
  className,
}: SparklineProps) => {
  const reactId = useId();
  const paths = sparklinePath(data, width, height);
  if (!paths) return null;
  // `useId` emits `:r0:` / `«r0»`; strip to a plain id usable inside url(#…).
  const gid = `spk-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ display: "block" }}
      {...(ariaLabel
        ? { role: "img", "aria-label": ariaLabel }
        : { "aria-hidden": true })}
    >
      {fill && (
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={paths.area} fill={`url(#${gid})`} data-part="area" />}
      <path
        d={paths.line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-part="line"
      />
    </svg>
  );
};

export default Sparkline;
