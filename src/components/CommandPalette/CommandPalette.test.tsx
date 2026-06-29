import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette, filterSections } from "./CommandPalette";
import type { CommandSection } from "./CommandPalette.types";

const sections: CommandSection[] = [
  {
    id: "nav",
    title: "Navigate",
    items: [
      { id: "dash", label: "Dashboard", path: "/dashboard" },
      { id: "inv", label: "Invoices", path: "/invoices" },
    ],
  },
  {
    id: "create",
    title: "Create",
    items: [{ id: "new-inv", label: "New invoice", path: "/invoices/add" }],
  },
];

describe("filterSections", () => {
  it("returns all sections for an empty query", () => {
    expect(filterSections(sections, "")).toHaveLength(2);
  });

  it("filters items by label and drops empty sections", () => {
    const result = filterSections(sections, "invoice");
    expect(result).toHaveLength(2);
    expect(result.flatMap((s) => s.items).map((i) => i.id)).toEqual([
      "inv",
      "new-inv",
    ]);
  });
});

describe("CommandPalette", () => {
  it("renders sections and selects on click", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette sections={sections} onSelect={onSelect} onClose={onClose} />,
    );
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Invoices"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "inv" }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("filters as the user types and selects with Enter", () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette sections={sections} onSelect={onSelect} onClose={() => {}} />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "new" } });
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "new-inv" }),
    );
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <CommandPalette sections={sections} onSelect={() => {}} onClose={onClose} />,
    );
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
