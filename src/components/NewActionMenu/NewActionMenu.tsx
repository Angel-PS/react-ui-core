import { useEffect, useState, type MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "../../hooks";
import { cn } from "../../lib/utils";

export interface NewActionOption {
  id: string;
  label: string;
  hint?: string;
  icon: IconDefinition;
  /** Destination path passed to `onSelect`. */
  path?: string;
  disabled?: boolean;
  /** Highlight as the default/primary action (shows a badge). */
  primary?: boolean;
}

export interface NewActionGroup {
  /** Column heading (already translated). */
  title: string;
  items: NewActionOption[];
}

export interface NewActionMenuLabels {
  trigger: string;
  defaultBadge: string;
  comingSoon: string;
  soon: string;
}

export interface NewActionMenuProps {
  /** Columns of quick-create actions (rendered side by side). */
  groups: NewActionGroup[];
  /** Called with an option's `path` when selected. */
  onSelect: (path: string) => void;
  labels?: Partial<NewActionMenuLabels>;
}

const DEFAULT_LABELS: NewActionMenuLabels = {
  trigger: "New",
  defaultBadge: "Default",
  comingSoon: "Coming soon",
  soon: "Soon",
};

const OptionRow = ({
  option,
  labels,
  onSelect,
}: {
  option: NewActionOption;
  labels: NewActionMenuLabels;
  onSelect: () => void;
}) => {
  const iconWrap = (
    <span className="bg-primary-blue-lightest text-primary-blue-default flex h-8 w-8 shrink-0 place-items-center justify-center rounded-lg transition-colors group-hover:bg-white dark:group-hover:bg-slate-700">
      <FontAwesomeIcon icon={option.icon} className="text-[12px]" />
    </span>
  );
  const body = (
    <span className="min-w-0 flex-1 text-left">
      <span className="block text-[13px] leading-tight font-medium text-gray-800 dark:text-slate-100">
        {option.label}
      </span>
      {option.hint && (
        <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-slate-400">
          {option.hint}
        </span>
      )}
    </span>
  );

  if (option.disabled) {
    return (
      <button
        type="button"
        disabled
        title={labels.comingSoon}
        className="group flex w-full cursor-not-allowed items-center gap-3 rounded-md bg-transparent px-2.5 py-2 opacity-50"
      >
        {iconWrap}
        {body}
        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wider text-gray-400 uppercase dark:bg-slate-800 dark:text-slate-500">
          {labels.soon}
        </span>
      </button>
    );
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (option.path) onSelect();
  };

  return (
    <a
      href={option.path ?? "#"}
      onClick={handleClick}
      className="group hover:bg-primary-blue-lightest flex w-full items-center gap-3 rounded-md bg-transparent px-2.5 py-2 transition-colors"
    >
      {iconWrap}
      {body}
      {option.primary && (
        <span className="bg-primary-blue-default shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wider text-white uppercase">
          {labels.defaultBadge}
        </span>
      )}
    </a>
  );
};

/**
 * Navbar "new action" mega-menu: a gradient trigger that opens a multi-column
 * grid of quick-create shortcuts. Decoupled from any router — items render
 * `<a href>` and call `onSelect(path)` on click.
 */
export const NewActionMenu = ({
  groups,
  onSelect,
  labels,
}: NewActionMenuProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSelect = (path?: string) => {
    setOpen(false);
    if (path) onSelect(path);
  };

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="from-primary-blue-default to-primary-blue-dark hover:from-primary-blue-hover focus-visible:ring-primary-blue-light flex items-center gap-2 rounded-full bg-linear-to-br px-4 py-2.5 text-[12.5px] font-bold text-white shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
      >
        <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
        <span>{l.trigger}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn("text-[9px] transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fadeIn absolute top-[calc(100%+8px)] right-0 z-50 w-[520px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`,
            }}
          >
            {groups.map((group, gi) => (
              <div
                key={group.title}
                className={cn(
                  "p-3",
                  gi < groups.length - 1 &&
                    "border-r border-gray-100 dark:border-slate-800",
                )}
              >
                <div className="mb-2 px-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((option) => (
                    <OptionRow
                      key={option.id}
                      option={option}
                      labels={l}
                      onSelect={() => handleSelect(option.path)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewActionMenu;
