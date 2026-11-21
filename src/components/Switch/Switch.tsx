import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "type" | "role" | "aria-checked" | "value"
  > {
  /** Controlled on/off state. */
  checked: boolean;
  /** Called with the NEXT state when the user flips the switch. */
  onChange: (next: boolean) => void;
}

/**
 * Controlled on/off toggle rendered as a `role="switch"` button (not a
 * checkbox — use `InputToggle` for a form-bound checkbox). Name it with
 * `aria-label`, `aria-labelledby`, or a `<label htmlFor={id}>`.
 *
 * Forwards its ref to the `<button>`. `forwardRef` rather than a `ref` prop
 * because the library supports React >= 17.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, onClick, disabled, className, ...props }, ref) => {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      onChange(!checked);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        {...props}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-blue-light focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          checked ? "bg-primary-blue-default" : "bg-gray-200 dark:bg-slate-700",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
