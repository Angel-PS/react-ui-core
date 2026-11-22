import { useEffect } from "react";

/**
 * Locks body scroll while the modal is mounted. Escape handling lives in
 * `useDialogA11y` (top-most dialog only, and only when `closeOnEscape`).
 */
export const useModal = () => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
};
