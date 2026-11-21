import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "classic"
    | "cancel"
    | "active-filter"
    | "inactive-filter"
    | "toolbar-button"
    | "segment-active"
    | "segment-inactive"
    | "segment-brand-active"
    | "segment-brand-inactive"
    | "link"
    | "chip"
    | "fab";
}

/**
 * Forwards its ref to the `<button>` (e.g. to hand focus back to a popover's
 * trigger when it closes). `forwardRef` rather than a `ref` prop because the
 * library supports React >= 17, where function components don't receive `ref`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, variant = "primary", disabled, ...props }, ref) => {
    const base =
      "font-sans inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.875rem] font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-blue-light focus-visible:ring-offset-1 disabled:cursor-default disabled:shadow-none active:translate-y-px";

    const styles = {
      classic: `${base} bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-800 shadow-xs hover:border-gray-300 dark:hover:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-500`,
      primary: `${base} bg-primary-blue-default hover:bg-primary-blue-hover text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:bg-primary-blue-default`,
      secondary: `${base} bg-primary-blue-lightest hover:bg-primary-blue-lighter text-primary-blue-dark shadow-xs disabled:opacity-50`,
      cancel: `${base} bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md focus-visible:ring-red-300 disabled:opacity-50 disabled:hover:bg-red-500`,
      "active-filter": `font-sans cursor-pointer rounded-lg px-4 py-1.5 text-[0.875rem] border border-primary-blue-light font-semibold transition-all duration-200 text-primary-blue-default bg-primary-blue-lightest shadow-xs`,
      "inactive-filter": `font-sans cursor-pointer rounded-lg border border-transparent px-4 py-1.5 text-[0.875rem] font-medium transition-all duration-200 bg-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200`,
      "toolbar-button": `rounded-lg p-2 text-gray-500 dark:text-slate-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 disabled:text-gray-300 dark:disabled:text-slate-600 disabled:hover:bg-transparent`,
      // Segmented control — a one-of-N view switcher sitting on a recessed track.
      // Self-contained like the filter variants (deliberately NOT built on
      // `base`, whose px-4/py-2.5 is too heavy for a segment).
      //
      // Focus ring uses `primary-blue-hover`, not `primary-blue-light`: in dark
      // mode the light ramp remaps to #38456b, which is 1.55:1 against the
      // slate-800 track — an invisible ring. `ring-offset-0` because the default
      // white offset would draw a halo inside the track.
      "segment-active": `font-sans inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold outline-none transition-colors duration-200 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-xs focus-visible:ring-2 focus-visible:ring-primary-blue-hover focus-visible:ring-offset-0`,
      "segment-inactive": `font-sans inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium outline-none transition-colors duration-200 bg-transparent text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-primary-blue-hover focus-visible:ring-offset-0`,
      // Segmented control that sits ON a brand-gradient surface (the dashboard
      // hero). That surface is theme-INVARIANT: it paints the brand ramp through
      // var(), and `.dark` remaps the ramp *lighter*
      // (#1f337e/#4061a8/#2f4cbc -> #4061a8/#5b82d6/#7c9eed). So a `dark:` variant
      // here moves text and background the same direction and collapses contrast
      // — that is why these deliberately have none, unlike `segment-*` above.
      // Requires the wrapper track to be `bg-black/30`: on the hero's own
      // `bg-white/15` even pure white bottoms out at 2.24:1 against the dark-mode
      // gradient. Ring is white, not primary-blue-hover — a blue ring on a blue
      // gradient measures 1.05-1.55:1 against the 3:1 floor of SC 1.4.11.
      "segment-brand-active": `font-sans inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-semibold outline-none transition-colors duration-200 bg-white text-gray-900 shadow-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0`,
      "segment-brand-inactive": `font-sans inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-medium outline-none transition-colors duration-200 bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0`,
      // An inline text action that sits inside a sentence (e.g. "Precio de lista:
      // US$ 39.00 · Usar"). Deliberately NOT built on `base`: its px-4/py-2.5 box
      // would break the line it belongs to. Underline on hover rather than a
      // color shift, so the affordance survives for colorblind users.
      link: `font-sans inline cursor-pointer rounded-sm bg-transparent p-0 text-inherit font-semibold outline-none transition-colors duration-200 text-primary-blue-default hover:text-primary-blue-hover hover:underline focus-visible:ring-2 focus-visible:ring-primary-blue-hover disabled:cursor-default disabled:text-gray-400 dark:disabled:text-slate-500 disabled:no-underline`,
      // A status pill that is also a trigger (e.g. it opens a detail popover).
      // Colourless ON PURPOSE: the caller passes the status tone (background +
      // text, light and dark) through `className`. Any colour baked in here would
      // fight that tone in tailwind-merge — `classic` did, its `hover:bg-gray-50`
      // bleached every tone on hover. Hover dims instead of repainting.
      chip: `font-sans inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold outline-none ring-1 ring-black/5 ring-inset transition-opacity duration-200 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary-blue-hover dark:ring-white/10 disabled:cursor-default disabled:opacity-60`,
      // Floating action button: a round, icon-only launcher pinned over the page
      // (the AI assistant). Always pair it with an `aria-label`. The ring offset
      // follows the page background so the focus halo stays visible in dark mode.
      fab: `font-sans inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary-blue-default text-white text-xl shadow-lg outline-none transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary-blue-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary-blue-light focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:translate-y-px motion-reduce:transition-none disabled:cursor-default disabled:opacity-60`,
    };

    return (
      <button
        ref={ref}
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
  },
);

Button.displayName = "Button";

export default Button;
