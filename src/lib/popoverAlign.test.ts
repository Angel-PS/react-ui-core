import { describe, expect, it } from "vitest";
import { fixedPopoverPosition, pickHorizontalAnchor } from "./popoverAlign";

// A 288px-wide panel (`w-72`) inside a container spanning x 200..1000 — roughly
// <main> once the 236px sidebar is laid out beside it.
const bounds = { left: 200, right: 1000 };
const WIDTH = 288;

describe("pickHorizontalAnchor", () => {
  it("anchors right when the panel fits growing leftward", () => {
    expect(pickHorizontalAnchor({ left: 800, right: 900 }, bounds, WIDTH)).toBe(
      "right",
    );
  });

  it("flips to left when growing leftward would overflow the container", () => {
    // This is the reported bug: the trigger sat at the left of <main>, so a
    // right-anchored panel spilled under the sidebar and got clipped.
    expect(pickHorizontalAnchor({ left: 250, right: 350 }, bounds, WIDTH)).toBe(
      "left",
    );
  });

  it("keeps the right anchor when neither direction fits", () => {
    const narrow = { left: 200, right: 400 };
    expect(pickHorizontalAnchor({ left: 250, right: 350 }, narrow, WIDTH)).toBe(
      "right",
    );
  });

  it("counts the gap as part of the required space", () => {
    const exact = { left: 400, right: 200 + 8 + WIDTH };
    expect(pickHorizontalAnchor(exact, bounds, WIDTH)).toBe("right");
    const tight = { left: 400, right: 200 + 8 + WIDTH - 1 };
    expect(pickHorizontalAnchor(tight, bounds, WIDTH)).toBe("left");
  });

  it("honours a custom gap", () => {
    const trigger = { left: 400, right: 200 + WIDTH + 4 };
    expect(pickHorizontalAnchor(trigger, bounds, WIDTH, 4)).toBe("right");
    expect(pickHorizontalAnchor(trigger, bounds, WIDTH, 32)).toBe("left");
  });
});

// The report column filters hang a fixed, portalled panel off a sticky header
// button (the table scroller would clip an absolute one). 1280×800 viewport.
describe("fixedPopoverPosition", () => {
  const viewport = { width: 1280, height: 800 };
  const panel = { width: WIDTH, height: 360 };
  const button = (left: number, top = 180) => ({
    left,
    right: left + 24,
    top,
    bottom: top + 24,
  });

  it("opens below, growing leftward from the button", () => {
    const pos = fixedPopoverPosition(button(900), panel, viewport);
    expect(pos.placement).toBe("below");
    expect(pos.top).toBe(180 + 24 + 6);
    expect(pos.left).toBe(900 + 24 - WIDTH);
  });

  it("flips to grow rightward next to the left edge", () => {
    expect(fixedPopoverPosition(button(40), panel, viewport).left).toBe(40);
  });

  it("stays inside the viewport on a narrow screen", () => {
    const pos = fixedPopoverPosition(button(10), panel, {
      width: 300,
      height: 800,
    });
    expect(pos.left).toBeGreaterThanOrEqual(8);
    expect(pos.left + WIDTH).toBeLessThanOrEqual(300);
  });

  it("opens above when the room below is short and smaller", () => {
    const pos = fixedPopoverPosition(button(900, 700), panel, viewport);
    expect(pos.placement).toBe("above");
    expect(pos.top).toBeGreaterThanOrEqual(8);
    expect(pos.maxHeight).toBeGreaterThan(600);
  });

  it("caps its height to the room it has", () => {
    expect(
      fixedPopoverPosition(
        button(900, 400),
        { width: WIDTH, height: 900 },
        viewport,
      ).maxHeight,
    ).toBe(800 - 424 - 6 - 8);
  });
});
