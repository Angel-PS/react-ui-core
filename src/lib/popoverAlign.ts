/**
 * Horizontal anchoring for dropdown panels that hang under a trigger.
 *
 * A panel anchored `right-0` grows leftward from its trigger, which breaks when
 * the trigger sits near the left edge of a clipping container: the panel spills
 * outside and gets cut off (e.g. `<main>` is `overflow-auto`, so it clipped the
 * filters panel at the sidebar's edge). Measuring the space actually available
 * lets the panel flip to `left-0` and grow the other way instead.
 */

export type Anchor = "left" | "right";

interface Bounds {
  left: number;
  right: number;
}

const OVERFLOW_CLIPS = /(auto|scroll|hidden|clip)/;

/**
 * Which edge a `panelWidth`-wide panel should anchor to, given the trigger box
 * and the bounds it must stay inside. Prefers `right` (the panel grows left,
 * which reads better for right-aligned triggers) and only flips when that
 * doesn't fit but growing rightward does.
 */
export const pickHorizontalAnchor = (
  trigger: Bounds,
  bounds: Bounds,
  panelWidth: number,
  gap = 8,
): Anchor => {
  if (trigger.right - panelWidth >= bounds.left + gap) return "right";
  if (trigger.left + panelWidth <= bounds.right - gap) return "left";
  return "right";
};

/** Edges of the nearest ancestor that clips horizontally; the viewport otherwise. */
const clippingBounds = (el: HTMLElement): Bounds => {
  for (
    let node = el.parentElement;
    node && node !== document.body;
    node = node.parentElement
  ) {
    const { overflow, overflowX } = getComputedStyle(node);
    if (OVERFLOW_CLIPS.test(`${overflow} ${overflowX}`)) {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }
  }
  return { left: 0, right: window.innerWidth };
};

/** Measures `trigger` and its clipping container to pick the panel's anchor. */
export const horizontalAnchorFor = (
  trigger: HTMLElement | null,
  panelWidth: number,
): Anchor => {
  if (!trigger) return "right";
  return pickHorizontalAnchor(
    trigger.getBoundingClientRect(),
    clippingBounds(trigger),
    panelWidth,
  );
};

export interface FixedPopoverPosition {
  top: number;
  left: number;
  /** Room the panel may use before it would leave the viewport. */
  maxHeight: number;
  placement: "below" | "above";
}

interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Below this much room the panel opens above its trigger instead (if there is more there). */
const MIN_COMFORTABLE_HEIGHT = 320;
const MIN_PANEL_HEIGHT = 160;

/**
 * Viewport coordinates for a `position: fixed` panel hanging off `trigger`. For
 * panels portalled out of a scroll container — a report's sticky column header,
 * whose scroller would otherwise clip them. Same horizontal rule as the
 * absolutely positioned panels (prefer growing leftward, flip when it does not
 * fit), clamped inside the viewport; vertically it opens below unless the room
 * above is both needed and larger.
 */
export const fixedPopoverPosition = (
  trigger: Box,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  gap = 6,
  margin = 8,
): FixedPopoverPosition => {
  const anchor = pickHorizontalAnchor(
    trigger,
    { left: 0, right: viewport.width },
    panel.width,
    margin,
  );
  const preferred =
    anchor === "right" ? trigger.right - panel.width : trigger.left;
  const left = Math.min(
    Math.max(preferred, margin),
    Math.max(margin, viewport.width - panel.width - margin),
  );

  const spaceBelow = viewport.height - trigger.bottom - gap - margin;
  const spaceAbove = trigger.top - gap - margin;
  const below =
    spaceBelow >= Math.min(panel.height, MIN_COMFORTABLE_HEIGHT) ||
    spaceBelow >= spaceAbove;
  const maxHeight = Math.max(MIN_PANEL_HEIGHT, below ? spaceBelow : spaceAbove);
  const top = below
    ? trigger.bottom + gap
    : Math.max(margin, trigger.top - gap - Math.min(panel.height, maxHeight));

  return { top, left, maxHeight, placement: below ? "below" : "above" };
};
