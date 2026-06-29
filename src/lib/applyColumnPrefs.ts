import type { HeaderColumn, TableColumnPref } from "../types";

/**
 * Apply a user's saved column preference to a table's full column catalog,
 * producing the headers actually rendered (reordered + visible only).
 *
 * Forward-compatible by design:
 * - Columns shipped in a future release (present in `catalog`, absent from the
 *   saved `order`) are appended in catalog order, so they appear by default
 *   instead of silently disappearing.
 * - Accessors in the saved pref that no longer exist in `catalog` (a removed
 *   column) are ignored — no crash, no empty cells.
 * - At least one column is always returned; if a pref would hide everything,
 *   the first catalog column is shown.
 * - `locked` columns are always visible: a saved (or hand-edited) pref can never
 *   hide a pinned column, regardless of what `hidden` says.
 *
 * Preferences key on {@link HeaderColumn.accessor} (stable, untranslated), so
 * `catalog` may be already-translated and the result is language-independent.
 */
export function applyColumnPrefs(
  catalog: HeaderColumn[],
  pref?: TableColumnPref,
): HeaderColumn[] {
  if (!pref) return catalog;

  const byAccessor = new Map(catalog.map((h) => [h.accessor, h]));
  // A locked column can never be hidden, even if a stale pref lists it.
  const hidden = new Set(pref.hidden.filter((a) => !byAccessor.get(a)?.locked));

  // (a) saved order first…
  const ordered: HeaderColumn[] = [];
  for (const accessor of pref.order) {
    const header = byAccessor.get(accessor);
    if (header) {
      ordered.push(header);
      byAccessor.delete(accessor);
    }
  }
  // …then any catalog columns not covered by the saved order (e.g. new columns).
  for (const header of catalog) {
    if (byAccessor.has(header.accessor)) ordered.push(header);
  }

  // (b) drop hidden columns
  let visible = ordered.filter((h) => !hidden.has(h.accessor));

  // (c) never render a headerless table
  if (visible.length === 0 && catalog.length > 0) visible = [catalog[0]];

  return visible;
}
