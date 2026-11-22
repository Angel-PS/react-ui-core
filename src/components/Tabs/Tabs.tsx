import { useRef, type KeyboardEvent, type ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../Button";
import { cn } from "../../lib/utils";

export interface TabItem {
  /** Stable id (ASCII). Becomes part of the DOM ids and the `data-tab` hook. */
  id: string;
  /** Already translated — this component never translates. */
  label: string;
  icon?: IconDefinition;
  /** Validation errors inside this tab's panel. 0 / undefined renders no badge. */
  errorCount?: number;
  /** Screen-reader description of the error badge, e.g. "2 errors". Overrides `labels.errors`. */
  errorLabel?: string;
  /**
   * Items waiting inside this tab (e.g. pending requests): a neutral badge,
   * shown only when there are no errors to report. 0 / undefined renders none.
   */
  count?: number;
  /** Screen-reader description of the count badge, e.g. "3 pending". Overrides `labels.count`. */
  countLabel?: string;
  disabled?: boolean;
}

export interface TabsLabels {
  /** Fallback screen-reader text for an error badge when the item has no `errorLabel`. */
  errors: (count: number) => string;
  /** Fallback screen-reader text for a count badge when the item has no `countLabel`. */
  count: (count: number) => string;
}

export const DEFAULT_TABS_LABELS: TabsLabels = {
  errors: (n) => (n === 1 ? "1 error" : `${n} errors`),
  count: (n) => (n === 1 ? "1 item" : `${n} items`),
};

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const tabPanelId = (prefix: string, id: string) =>
  `${prefix}-panel-${id}`;

export interface TabsProps {
  items: TabItem[];
  /** The active tab id (controlled). */
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  ariaLabel: string;
  /**
   * ASCII id namespace shared with every `<TabPanel>`. Must be unique on the
   * page. Deliberately NOT `useId()`: React 18+ ids (`:r0:` / `«r0»`) are valid
   * id attributes but not valid CSS identifiers, so the `data-tab` lookup would
   * need `CSS.escape`.
   */
  idPrefix: string;
  labels?: Partial<TabsLabels>;
  className?: string;
}

/**
 * Accessible one-of-N switcher built on the `Button` segment variants.
 *
 * Selection follows focus (the WAI-ARIA default for cheap panels): every panel
 * is already in the DOM (see `TabPanel`), so switching costs nothing. Arrow
 * Left/Right wrap around, Home/End jump to the ends, and disabled tabs are
 * skipped.
 */
export const Tabs = ({
  items,
  value,
  onChange,
  ariaLabel,
  idPrefix,
  labels,
  className,
}: TabsProps) => {
  const l = { ...DEFAULT_TABS_LABELS, ...labels };
  const listRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    onChange(id);
    // Looked up by `data-tab` rather than kept in a ref array: one query, no
    // per-item ref bookkeeping.
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab="${id}"]`)
      ?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.id === value);
    const last = enabled.length - 1;
    if (index < 0 || last < 0) return;
    const next =
      event.key === "ArrowRight"
        ? enabled[index === last ? 0 : index + 1]
        : event.key === "ArrowLeft"
          ? enabled[index === 0 ? last : index - 1]
          : event.key === "Home"
            ? enabled[0]
            : event.key === "End"
              ? enabled[last]
              : null;
    if (!next) return;
    event.preventDefault();
    select(next.id);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={cn(
        "flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-slate-800",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        const errors = item.errorCount ?? 0;
        const count = errors > 0 ? 0 : (item.count ?? 0);
        const errorsId = `${tabId(idPrefix, item.id)}-errors`;
        const countId = `${tabId(idPrefix, item.id)}-count`;
        const badgeId = errors > 0 ? errorsId : count > 0 ? countId : undefined;
        return (
          <Button
            key={item.id}
            type="button"
            data-tab={item.id}
            id={tabId(idPrefix, item.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={tabPanelId(idPrefix, item.id)}
            aria-describedby={badgeId}
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            variant={isActive ? "segment-active" : "segment-inactive"}
            onClick={() => onChange(item.id)}
            // `relative` anchors the badges' sr-only labels to the tab, not to
            // the document (an unanchored sr-only box can stretch the page).
            className="relative min-w-0 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                aria-hidden="true"
                className="shrink-0 text-[0.75rem]"
              />
            )}
            <span className="truncate">{item.label}</span>
            {errors > 0 && (
              <>
                <span
                  aria-hidden="true"
                  className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-red-50 px-1.5 py-0.5 text-[0.6875rem] font-bold lining-nums tabular-nums text-red-700 dark:bg-red-950/40 dark:text-red-300"
                >
                  {errors}
                </span>
                {/* The bare number means nothing to a screen reader; this says
                    what it counts. */}
                <span id={errorsId} className="sr-only">
                  {item.errorLabel ?? l.errors(errors)}
                </span>
              </>
            )}
            {count > 0 && (
              <>
                <span
                  aria-hidden="true"
                  className="bg-primary-blue-lightest text-primary-blue-dark inline-flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.6875rem] font-bold lining-nums tabular-nums"
                >
                  {count}
                </span>
                <span id={countId} className="sr-only">
                  {item.countLabel ?? l.count(count)}
                </span>
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export interface TabPanelProps {
  idPrefix: string;
  /** This panel's tab id. */
  id: string;
  /** The currently active tab id. */
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * A tab panel that is ALWAYS MOUNTED, hidden when inactive.
 *
 * That is load-bearing, not a style choice: form libraries (react-hook-form)
 * unregister an input when it unmounts and drop its value, so conditionally
 * rendering a panel would silently blank fields the user filled on another tab.
 *
 * BOTH the `hidden` attribute and the `hidden` class are applied on purpose.
 * The UA sheet's `[hidden] { display: none }` loses to any later display
 * utility in the cascade, so the class guarantees the hide while the attribute
 * removes the panel from the accessibility tree and from find-in-page. For the
 * same reason, NEVER pass a display utility (`flex`, `grid`, `block`) in
 * `className` — put it on a wrapper inside the panel.
 */
export const TabPanel = ({
  idPrefix,
  id,
  value,
  children,
  className,
}: TabPanelProps) => {
  const isActive = id === value;
  return (
    <div
      id={tabPanelId(idPrefix, id)}
      role="tabpanel"
      aria-labelledby={tabId(idPrefix, id)}
      hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        !isActive && "hidden",
        "focus-visible:ring-primary-blue-hover rounded-lg focus:outline-none focus-visible:ring-2",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Tabs;
