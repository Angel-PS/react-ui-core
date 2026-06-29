import { Fragment, useEffect, useState, type MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export interface BreadcrumbItem {
  /** Display label (already translated). */
  label: string;
  /** If set, the crumb is a clickable link to this path. */
  to?: string;
}

export interface BreadcrumbsLabels {
  ariaLabel: string;
  ellipsisLabel: string;
}

export interface BreadcrumbsProps {
  /** Trail from root to current page. The last item is the current page. */
  items: BreadcrumbItem[];
  /** Called when a clickable crumb is activated (replaces router navigation). */
  onNavigate: (path: string) => void;
  /** Trails longer than this collapse to `first / … / last 2`. Default 4. */
  maxVisible?: number;
  labels?: Partial<BreadcrumbsLabels>;
}

type RenderItem =
  | { kind: "item"; data: BreadcrumbItem }
  | { kind: "ellipsis"; hidden: BreadcrumbItem[] };

const DEFAULT_LABELS: BreadcrumbsLabels = {
  ariaLabel: "Breadcrumb",
  ellipsisLabel: "Show hidden levels",
};

/** Collapse a long trail into `first / … / last (maxVisible-2)`. */
export function collapseTrail(
  trail: BreadcrumbItem[],
  maxVisible = 4,
): RenderItem[] {
  if (trail.length <= maxVisible) {
    return trail.map((data) => ({ kind: "item", data }));
  }
  const tailCount = maxVisible - 2;
  const head = trail[0];
  const hidden = trail.slice(1, trail.length - tailCount);
  const tail = trail.slice(trail.length - tailCount);
  return [
    { kind: "item", data: head },
    { kind: "ellipsis", hidden },
    ...tail.map<RenderItem>((data) => ({ kind: "item", data })),
  ];
}

/**
 * Presentational breadcrumb bar. The consumer supplies the resolved `items`
 * (label + optional `to`); clickable crumbs call `onNavigate(to)`. Long trails
 * collapse with an expandable ellipsis. The current page is the last item.
 */
export const Breadcrumbs = ({
  items: trail,
  onNavigate,
  maxVisible = 4,
  labels,
}: BreadcrumbsProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [overflowOpen, setOverflowOpen] = useState(false);

  useEffect(() => {
    if (!overflowOpen) return;
    const onMouseDown = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.("[data-bc-overflow]")) setOverflowOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [overflowOpen]);

  if (!trail || trail.length === 0) return null;

  const items = collapseTrail(trail, maxVisible);

  const go = (e: MouseEvent, to: string) => {
    e.preventDefault();
    onNavigate(to);
  };

  const renderSeparator = (i: number) => (
    <FontAwesomeIcon
      key={`sep-${i}`}
      icon={faChevronRight}
      aria-hidden="true"
      className="shrink-0 text-[10px] text-gray-300 dark:text-slate-600"
    />
  );

  return (
    <div
      className="flex h-11 shrink-0 items-center border-b border-gray-200 bg-white px-4 lg:px-8 dark:border-slate-800 dark:bg-slate-900"
      aria-label={l.ariaLabel}
    >
      <nav className="flex w-full min-w-0 items-center gap-1.5 text-[13px]">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          const sep = i > 0 ? renderSeparator(i) : null;

          if (it.kind === "ellipsis") {
            return (
              <Fragment key={`el-${i}`}>
                {sep}
                <div className="relative" data-bc-overflow>
                  <button
                    type="button"
                    onClick={() => setOverflowOpen((o) => !o)}
                    title={l.ellipsisLabel}
                    aria-label={l.ellipsisLabel}
                    className="rounded border-0 bg-transparent px-1.5 py-0.5 text-[14px] leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    …
                  </button>
                  {overflowOpen && (
                    <div className="absolute top-full left-0 z-30 mt-1 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      {it.hidden.map((h, j) =>
                        h.to ? (
                          <a
                            key={j}
                            href={h.to}
                            onClick={(e) => {
                              go(e, h.to!);
                              setOverflowOpen(false);
                            }}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            {h.label}
                          </a>
                        ) : (
                          <span
                            key={j}
                            className="block w-full cursor-default px-3 py-1.5 text-left text-[12px] text-gray-400 dark:text-slate-500"
                          >
                            {h.label}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </Fragment>
            );
          }

          const item = it.data;

          if (isLast) {
            return (
              <Fragment key={`it-${i}`}>
                {sep}
                <span
                  aria-current="page"
                  className="truncate font-semibold text-gray-900 dark:text-slate-100"
                >
                  {item.label}
                </span>
              </Fragment>
            );
          }

          if (item.to) {
            return (
              <Fragment key={`it-${i}`}>
                {sep}
                <a
                  href={item.to}
                  onClick={(e) => go(e, item.to!)}
                  className="hover:text-primary-blue-default truncate text-gray-500 transition-colors dark:text-slate-400"
                >
                  {item.label}
                </a>
              </Fragment>
            );
          }

          return (
            <Fragment key={`it-${i}`}>
              {sep}
              <span className="truncate text-gray-400 dark:text-slate-500">
                {item.label}
              </span>
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
