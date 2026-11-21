// Shared status → badge/dot color map. Single source of truth for status colors
// across the library (table rows, selection lists, etc.).
export const statusStyles: Record<string, { badge: string; dot: string }> = {
  paid: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  delivered: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  completed: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  success: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  pending: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  pending_payment: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  processing: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  not_processed: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  waiting: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  draft: { badge: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-400" },
  cancelled: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  canceled: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  failed: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  rejected: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  closed: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  sent: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  shipped: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  dispatched: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  quotation: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  accepted: { badge: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  accepted_conditional: {
    badge: "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300",
    dot: "bg-yellow-500",
  },
  active: { badge: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  inactive: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  disabled: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  credit_note: { badge: "bg-orange-100/90 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300", dot: "bg-red-500" },
  new: { badge: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  in_use: { badge: "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-500" },
  exhausted: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  expired: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  revoked: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  published: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  scheduled: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  archived: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  test: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  production: { badge: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  trial: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  suspended: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  // Release tiers / lifecycle — red = forced, blue = suggested, slate = silent.
  critical: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  recommended: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  optional: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  // Published but pulled back.
  withdrawn: { badge: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
  free: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  basic: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  pro: { badge: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  enterprise: { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  // Document lifecycle. Without these they fall through to the slate fallback,
  // so "annulled" would look exactly like "created".
  created: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  signed: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  annulled: { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  received: { badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  unknown: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  // An add-on switched off (or never set up) is a choice, not a failure — slate,
  // never the red of `inactive`/`disabled`.
  paused: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  not_configured: {
    badge:
      "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-slate-700",
    dot: "bg-slate-300 dark:bg-slate-600",
  },
  // Deployment-environment badges (namespaced so they never collide with the
  // generic statuses above). Production is the high-alert red; lower environments
  // step down in intensity. Color is paired with a text label by the consumer, so
  // it is never the sole signal.
  "env-local": { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  "env-development": { badge: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300", dot: "bg-sky-500" },
  "env-staging": { badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300", dot: "bg-amber-500" },
  "env-production": { badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300", dot: "bg-red-500" },
};

export type StatusStyle = { badge: string; dot: string };

const FALLBACK_STATUS_STYLE: StatusStyle = {
  badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  dot: "bg-slate-400",
};

/**
 * Badge/dot classes for a status key (case-insensitive). `overrides` lets a
 * consumer add or recolor app-specific statuses without mutating the shared
 * {@link statusStyles} map; it wins over the defaults. Unknown keys fall back
 * to a neutral slate badge.
 */
export const getStatusStyle = (
  status: string,
  overrides?: Record<string, StatusStyle>,
): StatusStyle => {
  const key = status.toLowerCase();
  return overrides?.[key] ?? overrides?.[status] ?? statusStyles[key] ?? FALLBACK_STATUS_STYLE;
};
