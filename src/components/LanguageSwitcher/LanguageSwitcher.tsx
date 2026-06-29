import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "../../hooks";

export interface LanguageOption {
  /** Language code shown in the trigger (e.g. "es"). */
  code: string;
  /** Full name shown in the menu (e.g. "Español"). */
  label: string;
}

export interface LanguageSwitcherLabels {
  switchAria: string;
  menuLabel: string;
}

export interface LanguageSwitcherProps {
  /** Currently active language code. */
  current: string;
  languages: LanguageOption[];
  /** Called with the selected code. The consumer persists/applies it. */
  onChange: (code: string) => void;
  /** Disable rows while a change is in flight. */
  isPending?: boolean;
  labels?: Partial<LanguageSwitcherLabels>;
}

const DEFAULT_LABELS: LanguageSwitcherLabels = {
  switchAria: "Change language",
  menuLabel: "Language",
};

/**
 * Compact navbar language switcher. Controlled — the displayed language comes
 * from `current`; selecting one calls `onChange(code)`. The library does not
 * own any i18n runtime.
 */
export const LanguageSwitcher = ({
  current,
  languages,
  onChange,
  isPending,
  labels,
}: LanguageSwitcherProps) => {
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

  const select = (code: string) => {
    setOpen(false);
    if (code !== current) onChange(code);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={l.switchAria}
        className="focus-visible:ring-primary-blue-light inline-flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:outline-none dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <FontAwesomeIcon icon={faGlobe} className="text-base" />
        <span className="text-[11px] font-bold tracking-wide uppercase">
          {current}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={l.menuLabel}
          className="animate-fadeIn absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
        >
          <div className="p-1.5">
            {languages.map((lang) => {
              const isActive = lang.code === current;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  disabled={isPending}
                  onClick={() => select(lang.code)}
                  className="flex w-full items-center justify-between rounded-lg bg-transparent px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-default disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>{lang.label}</span>
                  {isActive && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-primary-blue-default text-xs"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
