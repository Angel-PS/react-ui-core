import { fireEvent, render } from "@testing-library/react";
import { MaintenanceFilters } from "./MaintenanceFilters";
import type { FilterController } from "./useFilterController";
import type { FilterDef } from "./types";

/**
 * Regression (ported from bluepos-client 1df0a13): when every filter is
 * popover-placed, the bar has no inline children and `justify-between` parked
 * the lone "Filters" trigger at the far LEFT. The panel is anchored to the
 * trigger and grows leftward, so it spilled outside the page's clipping
 * container and was cut off under the sidebar.
 *
 * Two guarantees are pinned here: the trigger is right-aligned even with no
 * inline filters, and the panel flips its anchor when growing leftward would
 * land outside the nearest clipping ancestor.
 */
const defs: FilterDef[] = [
  {
    kind: "dateRange",
    key: "date",
    label: "Date",
    fromKey: "from",
    toKey: "to",
    fromLabel: "From",
    toLabel: "To",
  },
  {
    kind: "select",
    key: "status",
    label: "Status",
    options: [{ value: "", label: "All statuses" }],
  },
];

const controller = (): FilterController => ({
  filters: defs,
  values: {},
  setValue: vi.fn(),
  setMany: vi.fn(),
  clear: vi.fn(),
});

const stubRect = (el: Element, left: number, right: number) => {
  el.getBoundingClientRect = () =>
    ({
      left,
      right,
      top: 0,
      bottom: 32,
      width: right - left,
      height: 32,
      x: left,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
};

/** Renders the bar inside a horizontally clipping shell, like a page's <main>. */
const setup = () => {
  const { container } = render(
    <div style={{ overflow: "auto" }} data-testid="shell">
      <MaintenanceFilters controller={controller()} />
    </div>,
  );
  const shell = container.querySelector<HTMLElement>('[data-testid="shell"]')!;
  const trigger = container.querySelector<HTMLElement>(
    'button[aria-haspopup="dialog"]',
  )!;
  return { container, shell, trigger };
};

/** The ≥sm dropdown — the mobile twin is the one carrying aria-modal. */
const desktopPanel = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="dialog"]:not([aria-modal])')!;

describe("FiltersPopover placement", () => {
  it("right-aligns the trigger even when no filter renders inline", () => {
    const { trigger } = setup();
    expect(trigger.closest(".ml-auto")).not.toBeNull();
    expect(trigger.closest(".flex.flex-wrap")?.className).not.toContain(
      "justify-between",
    );
  });

  it("anchors right when the panel fits inside the clipping ancestor", () => {
    const { container, shell, trigger } = setup();
    stubRect(shell, 200, 1000);
    stubRect(trigger.parentElement!, 800, 960);

    fireEvent.click(trigger);

    const panel = desktopPanel(container);
    expect(panel.className).toContain("right-0");
    expect(panel.className).not.toContain("left-0");
  });

  it("flips to the left edge when growing leftward would be clipped", () => {
    const { container, shell, trigger } = setup();
    stubRect(shell, 200, 1000); // the page, sidebar occupying 0..200
    stubRect(trigger.parentElement!, 250, 400); // trigger pinned to the left

    fireEvent.click(trigger);

    const panel = desktopPanel(container);
    expect(panel.className).toContain("left-0");
    expect(panel.className).not.toContain("right-0");
  });
});
