import React, { forwardRef } from "react";

interface InputCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
}

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  ({ label, error, id, loading, ...props }, ref) => {
    return (
      <div className="relative block">
        {!loading ? (
          <div className="flex items-center">
            <div className="h-[2.2rem] w-[2.2rem]">
              <div className="round">
                <input type="checkbox" ref={ref} id={id} {...props} />
                <label htmlFor={id}></label>
              </div>
            </div>
            <label htmlFor={id} className="cursor-pointer">
              {label}
            </label>
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
  ({ label, error, id, loading, ...props }, ref) => {
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
