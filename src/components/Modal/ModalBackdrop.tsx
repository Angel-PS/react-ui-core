import React from "react";

/**
 * Decorative only. It is `pointer-events-none`, so every press that misses the
 * panel lands on the overlay, which owns dismissal (see `Modal`).
 */
export const ModalBackdrop: React.FC = () => (
  <div
    className="pointer-events-none fixed inset-0 bg-slate-900/40 backdrop-blur-sm duration-300"
    aria-hidden="true"
  />
);

ModalBackdrop.displayName = "ModalBackdrop";
