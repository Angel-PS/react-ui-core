import { useEffect } from "react";
import type { ModalProps } from "./Modal.types";

export const useModal = ({
  onHide,
}: Pick<ModalProps, "onHide">) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onHide?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onHide]);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
};
