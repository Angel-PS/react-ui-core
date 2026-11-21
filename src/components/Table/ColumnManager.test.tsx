import { fireEvent, render, screen, within } from "@testing-library/react";
import { ColumnManager } from "./ColumnManager";
import type { HeaderColumn } from "../../types";

const catalog: HeaderColumn[] = [
  { value: "Name", accessor: "name", locked: true },
  { value: "RNC", accessor: "rnc" },
  { value: "Email", accessor: "email" },
  { value: "Address", accessor: "address", defaultHidden: true },
];

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

const trigger = () => screen.getByRole("button", { name: /columns/i });

/** The ≥sm dropdown — the mobile twin is the one carrying aria-modal. */
const desktopPanel = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="dialog"]:not([aria-modal])')!;

const checkboxFor = (container: HTMLElement, name: string) =>
  within(desktopPanel(container)).getByRole("checkbox", {
    name: new RegExp(`(hide|show) ${name}`, "i"),
  });

describe("ColumnManager", () => {
  it("starts an optional (defaultHidden) column unchecked without a pref", () => {
    const { container } = render(
      <ColumnManager columns={catalog} onApply={() => {}} />,
    );
    fireEvent.click(trigger());
    expect(checkboxFor(container, "Address")).not.toBeChecked();
    expect(checkboxFor(container, "Email")).toBeChecked();
  });

  it("bolds the shown count in the default summary", () => {
    const { container } = render(
      <ColumnManager columns={catalog} onApply={() => {}} />,
    );
    fireEvent.click(trigger());
    const bold = desktopPanel(container).querySelector("b");
    expect(bold).toHaveTextContent("3");
    expect(bold?.parentElement).toHaveTextContent("3 of 4 columns shown");
  });

  it("badges only the columns the user hid, not optional ones still off", () => {
    const { rerender } = render(
      <ColumnManager columns={catalog} onApply={() => {}} />,
    );
    // Address is hidden by default only — no badge.
    expect(trigger()).not.toHaveTextContent(/\d/);

    rerender(
      <ColumnManager
        columns={catalog}
        pref={{ order: ["name", "rnc", "email"], hidden: ["email"] }}
        onApply={() => {}}
      />,
    );
    expect(trigger()).toHaveTextContent("1");
  });

  it("restores defaults with optional columns hidden again", () => {
    const onApply = vi.fn();
    const { container } = render(
      <ColumnManager
        columns={catalog}
        pref={{ order: ["name", "address", "rnc", "email"], hidden: ["rnc"] }}
        onApply={onApply}
      />,
    );
    fireEvent.click(trigger());
    fireEvent.click(
      within(desktopPanel(container)).getByRole("button", {
        name: /restore defaults/i,
      }),
    );
    fireEvent.click(
      within(desktopPanel(container)).getByRole("button", { name: /done/i }),
    );
    expect(onApply).toHaveBeenCalledWith({
      order: ["name", "rnc", "email", "address"],
      hidden: ["address"],
    });
  });

  it("merges triggerClassName into the trigger", () => {
    render(
      <ColumnManager
        columns={catalog}
        onApply={() => {}}
        triggerClassName="h-10.75"
      />,
    );
    expect(trigger()).toHaveClass("h-10.75");
    expect(trigger()).toHaveClass("inline-flex");
  });

  describe("panel anchoring", () => {
    const setup = () => {
      const utils = render(
        <div style={{ overflow: "auto" }} data-testid="shell">
          <ColumnManager columns={catalog} onApply={() => {}} />
        </div>,
      );
      return { ...utils, shell: screen.getByTestId("shell") };
    };

    it("anchors right when the panel fits growing leftward", () => {
      const { container, shell } = setup();
      stubRect(shell, 0, 1200);
      stubRect(trigger().parentElement!, 900, 1000);
      fireEvent.click(trigger());
      expect(desktopPanel(container).className).toContain("right-0");
      expect(desktopPanel(container).className).not.toContain("left-0");
    });

    it("flips to the left edge when growing leftward would be clipped", () => {
      const { container, shell } = setup();
      stubRect(shell, 200, 1200);
      stubRect(trigger().parentElement!, 250, 350);
      fireEvent.click(trigger());
      expect(desktopPanel(container).className).toContain("left-0");
      expect(desktopPanel(container).className).not.toContain("right-0");
    });
  });
});
