import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "classic"
    | "cancel"
    | "active-filter"
    | "inactive-filter"
    | "toolbar-button";
}

export const Button: FC<ButtonProps> = ({
  children,
  loading,
  variant = "primary",
  disabled,
  ...props
}) => {
  const base =
    "font-sans inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.875rem] font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-blue-light focus-visible:ring-offset-1 disabled:cursor-default disabled:shadow-none active:translate-y-px";

  const styles = {
    classic: `${base} bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-800 shadow-xs hover:border-gray-300 dark:hover:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-500`,
    primary: `${base} bg-primary-blue-default hover:bg-primary-blue-hover text-white font-semibold shadow-sm hover:shadow-md disabled:bg-primary-blue-darker`,
    secondary: `${base} bg-primary-blue-lightest hover:bg-primary-blue-lighter text-primary-blue-dark shadow-xs disabled:opacity-50`,
    cancel: `${base} bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md focus-visible:ring-red-300 disabled:bg-red-600`,
    "active-filter": `font-sans cursor-pointer rounded-lg px-4 py-1.5 text-[0.875rem] border border-primary-blue-light font-semibold transition-all duration-200 text-primary-blue-default bg-primary-blue-lightest shadow-xs`,
    "inactive-filter": `font-sans cursor-pointer rounded-lg border border-transparent px-4 py-1.5 text-[0.875rem] font-medium transition-all duration-200 bg-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200`,
    "toolbar-button": `rounded-lg p-2 text-gray-500 dark:text-slate-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 disabled:text-gray-300 dark:disabled:text-slate-600 disabled:hover:bg-transparent`,
  };

  return (
    <button
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...props}
      className={cn(styles[variant], props.className)}
    >
      {loading && (
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
