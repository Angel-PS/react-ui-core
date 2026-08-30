// Pure, framework-agnostic formatting helpers used by Table / ColumnManager.
// No i18n, no app services — safe to ship in a library.

function getDateParts(date: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/**
 * Format a date to "DD-MM-YYYY" or "YYYY-MM-DD", optionally with "HH:MM" time.
 * A bare `YYYY-MM-DD` string is reformatted directly (no timezone shift) so
 * date-only values render exactly as stored. Pass `timeZone` (e.g.
 * "America/Caracas") to render in a specific zone; omit for local time.
 */
export function formatDate(
  timeInput: string | Date | null | undefined,
  format: "DD-MM-YYYY" | "YYYY-MM-DD" = "DD-MM-YYYY",
  showTime = false,
  timeZone?: string,
): string {
  if (!timeInput) return "";
  if (
    !showTime &&
    typeof timeInput === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(timeInput)
  ) {
    const [y, m, d] = timeInput.split("-");
    return format === "YYYY-MM-DD" ? `${y}-${m}-${d}` : `${d}-${m}-${y}`;
  }
  const date = new Date(timeInput);
  if (isNaN(date.getTime())) return "";
  const { year, month, day, hour, minute } = getDateParts(date, timeZone);
  let formatted =
    format === "YYYY-MM-DD" ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
  if (showTime) formatted += ` ${hour}:${minute}`;
  return formatted;
}

const RELATIVE_DIVISIONS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

/**
 * Localized relative time — "5 minutes ago" / "hace 5 minutos". Uses
 * `numeric: "auto"`, so a one-day gap reads "yesterday" rather than "1 day ago".
 *
 * `now` is a parameter, not a `Date.now()` read, for two reasons: it keeps the
 * function pure (and therefore testable), and it lets a caller derive the value
 * from state so a compiler that memoizes by dependencies cannot freeze the
 * label (see `useElapsedSince`).
 */
export function formatRelativeTime(
  timeInput: string | Date | number | null | undefined,
  now: number = Date.now(),
  locale = "en",
): string {
  if (timeInput === null || timeInput === undefined || timeInput === "") {
    return "";
  }
  const date = new Date(timeInput);
  if (isNaN(date.getTime())) return "";

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  let duration = (date.getTime() - now) / 1000;
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return "";
}

/** Format a number with thousands separators and fixed decimals (e.g. "1,234.50"). */
export function formatDecimal(value: number, decimals = 2): string {
  if (typeof value !== "number" || isNaN(value)) return "0.00";
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Initials from a name (first letter of up to `maxWords` words), uppercased. */
export function getInitials(name: string, maxWords = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, maxWords)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Turn a snake_case/lower status into a human label: "pending_payment" → "Pending payment". */
export function cleanStatusValue(status: string): string {
  const spaced = status.toLowerCase().replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Capitalize the first letter of every space-separated word. */
export function capitalizeWords(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
