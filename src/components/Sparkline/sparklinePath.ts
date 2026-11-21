export interface SparklinePaths {
  /** The smoothed stroke path. */
  line: string;
  /** The same path closed down to the baseline, for the gradient fill. */
  area: string;
}

/**
 * Pure path math for `<Sparkline>`: scales `data` into a `width`×`height` box
 * (2px vertical padding so the stroke is never clipped) and joins the points
 * with horizontal-tangent cubic curves. A flat series is drawn along the
 * bottom padding instead of dividing by zero. Returns `null` for no data.
 */
export const sparklinePath = (
  data: readonly number[],
  width: number,
  height: number,
): SparklinePaths | null => {
  const values = data.filter((v) => Number.isFinite(v));
  if (values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values.map<[number, number]>((v, i) => [
    i * stepX,
    height - ((v - min) / range) * (height - 4) - 2,
  ]);

  let line = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const cx = (x1 + x2) / 2;
    line += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area };
};
