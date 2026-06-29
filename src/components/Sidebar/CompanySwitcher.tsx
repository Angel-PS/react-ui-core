import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "../../hooks";
import { getInitials } from "../../lib/format";
import { cn } from "../../lib/utils";
import type {
  CompanyOption,
  CompanySwitcherLabels,
  CompanySwitcherProps,
} from "./Sidebar.types";

const DEFAULT_LABELS: CompanySwitcherLabels = {
  switchCompany: "Switch company",
  yourCompanies: "Your companies",
};

const mergeLabels = (
  labels?: Partial<CompanySwitcherLabels>,
): CompanySwitcherLabels => ({ ...DEFAULT_LABELS, ...labels });

/**
 * Presentational tenant/company switcher for the sidebar footer. Controlled via
 * props — the consumer owns the active company and the switch handler. Renders a
 * compact avatar button when collapsed and a full row (with a popover list) when
 * expanded.
 */
export const CompanySwitcher = ({
  activeCompany,
  companies,
  canSwitch,
  onSelectCompany,
  isCollapsed = false,
  labels,
}: CompanySwitcherProps) => {
  const l = mergeLabels(labels);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const switchable = canSwitch ?? companies.length > 1;
  const active =
    companies.find((c) => c.id === activeCompany?.id) ?? activeCompany ?? null;
  const displayName = active?.primaryLabel || active?.secondaryLabel || "-";
  const displaySecondary = active?.secondaryLabel || "-";
  const initials = getInitials(displayName);

  const handleSelect = (company: CompanyOption) => {
    setIsOpen(false);
    if (company.id !== activeCompany?.id) onSelectCompany(company.id);
  };

  return (
    <div ref={ref} className="relative">
      {isOpen && switchable && (
        <div
          className={cn(
            "absolute z-50 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900",
            isCollapsed
              ? "bottom-2 left-full ml-2 w-60"
              : "right-2 bottom-full left-2 mb-2",
          )}
        >
          <div className="border-b border-gray-100 px-3 py-2 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase dark:border-slate-800 dark:text-slate-500">
            {l.yourCompanies}
          </div>
          <ul className="py-1">
            {companies.map((c) => {
              const isActive = c.id === activeCompany?.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition-colors",
                      isActive
                        ? "bg-primary-blue-lightest"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800",
                    )}
                  >
                    <span className="bg-primary-blue-lightest text-primary-blue-default grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold">
                      {getInitials(c.primaryLabel || c.secondaryLabel || "-")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-gray-800 dark:text-slate-100">
                        {c.primaryLabel || c.secondaryLabel}
                      </span>
                      {c.primaryLabel && c.secondaryLabel && (
                        <span className="block truncate text-[10px] text-gray-400 dark:text-slate-500">
                          {c.secondaryLabel}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-primary-blue-default shrink-0 text-[11px]"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isCollapsed ? (
        <button
          type="button"
          title={switchable ? l.switchCompany : displayName}
          onClick={() => switchable && setIsOpen((o) => !o)}
          className={cn(
            "mx-auto grid h-10 w-10 place-items-center rounded-md bg-transparent p-0",
            switchable
              ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800"
              : "cursor-default",
          )}
        >
          <span className="bg-primary-blue-lightest text-primary-blue-default grid h-7 w-7 place-items-center rounded-lg text-[10px] font-bold">
            {initials}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => switchable && setIsOpen((o) => !o)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-transparent px-3 py-2 transition-colors dark:border-slate-800",
            switchable
              ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
              : "cursor-default",
          )}
        >
          <span className="bg-primary-blue-lightest text-primary-blue-default grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold">
            {initials}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[11.5px] font-semibold text-gray-800 dark:text-slate-100">
              {displayName}
            </span>
            <span className="block truncate text-[10px] text-gray-400 dark:text-slate-500">
              {displaySecondary}
            </span>
          </span>
          {switchable && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cn(
                "shrink-0 text-[9px] text-gray-400 transition-transform dark:text-slate-500",
                isOpen && "rotate-180",
              )}
            />
          )}
        </button>
      )}
    </div>
  );
};

export default CompanySwitcher;
