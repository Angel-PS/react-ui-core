import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";
import type {
  CommandItem,
  CommandPaletteLabels,
  CommandPaletteProps,
  CommandSection,
} from "./CommandPalette.types";

const DEFAULT_LABELS: CommandPaletteLabels = {
  title: "Command palette",
  inputAria: "Search commands",
  inputPlaceholder: "Search…",
  empty: "No results",
  hint: "↑↓ to navigate · ↵ to select · esc to close",
};

/** Case-insensitive label filter; drops sections left empty. */
export function filterSections(
  sections: CommandSection[],
  query: string,
): CommandSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return sections;
  return sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
    }))
    .filter((s) => s.items.length > 0);
}

/**
 * Top-aligned command palette. Mount it (conditional render) to open, unmount to
 * close. Presentational: pass `sections`; the palette filters them by the typed
 * query, supports ↑/↓/Enter/Esc, and calls `onSelect(item)` / `onClose()`. The
 * app owns what the items are and where they navigate.
 */
export const CommandPalette = ({
  sections,
  onSelect,
  onClose,
  labels,
}: CommandPaletteProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const filtered = useMemo(
    () => filterSections(sections, query),
    [sections, query],
  );
  const flatItems = useMemo(
    () => filtered.flatMap((s) => s.items),
    [filtered],
  );

  // Focus the input on open; restore focus to the trigger on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  // Keep the highlighted row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  const select = (item: CommandItem) => {
    onClose();
    onSelect(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        flatItems.length === 0 ? 0 : (i + 1) % flatItems.length,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        flatItems.length === 0 ? 0 : i <= 0 ? flatItems.length - 1 : i - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) select(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Keep focus trapped on the input; rows are arrow-navigated, not tabbed.
      e.preventDefault();
    }
  };

  const activeId =
    flatItems[activeIndex] != null
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  return (
    <div className="animate-fadeIn fixed inset-0 z-9999 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={l.title}
        className="animate-scaleIn relative z-50 flex max-h-[76vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10"
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-slate-800">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="shrink-0 text-sm text-gray-400 dark:text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-label={l.inputAria}
            placeholder={l.inputPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="h-14 flex-1 border-0 bg-transparent text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <kbd className="hidden shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-gray-400 sm:block dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          id={listboxId}
          aria-label={l.title}
          className="flex-1 overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400 dark:text-slate-500">
              {l.empty}
            </p>
          ) : (
            filtered.map((section) => (
              <div
                key={section.id}
                role="group"
                aria-label={section.title}
                className="mb-1"
              >
                <div className="px-2 pt-2 pb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const index = flatItems.findIndex((f) => f.id === item.id);
                    const isActive = index === activeIndex;
                    return (
                      <div
                        key={item.id}
                        id={`${listboxId}-opt-${index}`}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => select(item)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                          isActive
                            ? "bg-primary-blue-lightest"
                            : "hover:bg-gray-50 dark:hover:bg-slate-800",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] transition-colors",
                            isActive
                              ? "text-primary-blue-default bg-white dark:bg-slate-900"
                              : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400",
                          )}
                        >
                          {item.icon && <FontAwesomeIcon icon={item.icon} />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-gray-800 dark:text-slate-100">
                          {item.label}
                        </span>
                        {item.groupLabel && (
                          <span className="shrink-0 text-[11px] text-gray-400 dark:text-slate-500">
                            {item.groupLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center border-t border-gray-100 px-4 py-2.5 text-[11px] text-gray-400 dark:border-slate-800 dark:text-slate-500">
          {l.hint}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
