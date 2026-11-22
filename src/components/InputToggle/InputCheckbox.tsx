import React, { forwardRef, useEffect, useRef } from "react";

interface InputCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
  /**
   * Tri-state "some, not all" (a "select all" over a partly ticked list). Drawn
   * as a dash; it sets the native `indeterminate` property, which is what screen
   * readers announce as "mixed". InputCheckbox only.
   */
  indeterminate?: boolean;
  /**
   * 18px box for dense lists (a filter checklist), where the 28px form box
   * outweighs the text beside it. Not `size`: inputs already own that
   * attribute. InputCheckbox only.
   */
  compact?: boolean;
}

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  (
    { label, error, id, loading, indeterminate = false, compact = false, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // `indeterminate` has no HTML attribute — it only exists as a DOM property.
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className="relative block">
        {!loading ? (
          <div className="flex items-center">
            {/* px, like the .round box inside it: rem would drift from it as the
                root font size changes between breakpoints. */}
            <div
              className={
                compact ? "h-[18px] w-[18px] shrink-0" : "h-[2.2rem] w-[2.2rem]"
              }
            >
              <div className={compact ? "round round-sm" : "round"}>
                <input type="checkbox" ref={setRefs} id={id} {...props} />
                <label htmlFor={id}></label>
              </div>
            </div>
            {(!compact || label) && (
              <label htmlFor={id} className="cursor-pointer">
                {label}
              </label>
            )}
          </div>
        ) : (
          <div className="skeleton h-[1.8rem]"></div>
        )}
      </div>
    );
  },
);

InputCheckbox.displayName = "InputCheckbox";

export const InputToggle = forwardRef<HTMLInputElement, InputCheckboxProps>(
  (
    // `indeterminate`/`compact` are checkbox-only; pulled out so they never
    // reach the DOM as unknown attributes.
    { label, error, id, loading, indeterminate, compact, ...props },
    ref,
  ) => {
    return (
      <div className="relative block">
        {!loading ? (
          <div className="flex items-center gap-5">
            <div className="h-6 w-11 shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                ref={ref}
                id={id}
                {...props}
              />
              <label
                htmlFor={id}
                className="relative block h-6 w-11 cursor-pointer rounded-full bg-gray-200 dark:bg-slate-700 transition-colors duration-200 peer-checked:bg-primary-blue-default peer-focus-visible:ring-2 peer-focus-visible:ring-primary-blue-light peer-focus-visible:ring-offset-1 after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:duration-200 after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"
              ></label>
            </div>
            {label && (
              <label htmlFor={id} className="mt-[0.1rem] cursor-pointer">
                {label}
              </label>
            )}
          </div>
        ) : (
          <div className="skeleton h-[1.8rem]"></div>
        )}
      </div>
    );
  },
);

InputToggle.displayName = "InputToggle";
