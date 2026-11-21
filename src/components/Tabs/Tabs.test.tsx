import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabPanel, tabId, tabPanelId, type TabItem } from "./Tabs";

const ITEMS: TabItem[] = [
  { id: "general", label: "General" },
  { id: "members", label: "Members", count: 12 },
  { id: "audit", label: "Audit log", disabled: true },
  { id: "permissions", label: "Permissions", errorCount: 2 },
];

const Harness = ({ items = ITEMS, initial = "general" }: { items?: TabItem[]; initial?: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <>
      <Tabs items={items} value={value} onChange={setValue} ariaLabel="Role editor" idPrefix="role" />
      {items.map((item) => (
        <TabPanel key={item.id} idPrefix="role" id={item.id} value={value}>
          <input aria-label={`${item.id} field`} defaultValue="" />
        </TabPanel>
      ))}
    </>
  );
};

describe("tab id helpers", () => {
  it("namespace ids by prefix", () => {
    expect(tabId("role", "general")).toBe("role-tab-general");
    expect(tabPanelId("role", "general")).toBe("role-panel-general");
  });
});

describe("Tabs", () => {
  it("renders a named tablist with one selected, focusable tab (roving tabindex)", () => {
    render(<Harness />);
    expect(screen.getByRole("tablist", { name: "Role editor" })).toBeInTheDocument();
    const general = screen.getByRole("tab", { name: "General" });
    const members = screen.getByRole("tab", { name: /Members/ });
    expect(general).toHaveAttribute("aria-selected", "true");
    expect(general).toHaveAttribute("tabindex", "0");
    expect(members).toHaveAttribute("aria-selected", "false");
    expect(members).toHaveAttribute("tabindex", "-1");
  });

  it("wires tabs and panels with aria-controls / aria-labelledby", () => {
    render(<Harness />);
    const general = screen.getByRole("tab", { name: "General" });
    expect(general).toHaveAttribute("id", "role-tab-general");
    expect(general).toHaveAttribute("aria-controls", "role-panel-general");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "role-panel-general");
    expect(panel).toHaveAttribute("aria-labelledby", "role-tab-general");
  });

  it("moves with arrow keys, wraps, and skips disabled tabs", () => {
    render(<Harness />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Members/ })).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /Members/ }));
    // "Audit log" is disabled — ArrowRight jumps straight to Permissions.
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Permissions/ })).toHaveAttribute("aria-selected", "true");
    // Wraps back to the first tab.
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "General" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /Permissions/ })).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to the ends with Home / End", () => {
    render(<Harness initial="members" />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByRole("tab", { name: /Permissions/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByRole("tab", { name: "General" })).toHaveAttribute("aria-selected", "true");
  });

  it("does not select a disabled tab on click", () => {
    render(<Harness />);
    const audit = screen.getByRole("tab", { name: "Audit log" });
    expect(audit).toBeDisabled();
    fireEvent.click(audit);
    expect(screen.getByRole("tab", { name: "General" })).toHaveAttribute("aria-selected", "true");
  });

  it("describes the error badge for screen readers, with an English default", () => {
    render(<Harness />);
    const permissions = screen.getByRole("tab", { name: /Permissions/ });
    expect(permissions).toHaveAttribute("aria-describedby", "role-tab-permissions-errors");
    expect(document.getElementById("role-tab-permissions-errors")).toHaveTextContent("2 errors");
    expect(permissions).toHaveTextContent("2");
  });

  it("describes the count badge and prefers the per-item label", () => {
    render(
      <Harness
        items={[
          { id: "a", label: "A" },
          { id: "b", label: "B", count: 3, countLabel: "3 pendientes" },
          { id: "c", label: "C", count: 1 },
        ]}
        initial="a"
      />,
    );
    expect(document.getElementById("role-tab-b-count")).toHaveTextContent("3 pendientes");
    expect(document.getElementById("role-tab-c-count")).toHaveTextContent("1 item");
  });

  it("shows errors instead of the count when a tab has both", () => {
    render(
      <Harness items={[{ id: "a", label: "A", count: 5, errorCount: 1 }]} initial="a" />,
    );
    expect(document.getElementById("role-tab-a-errors")).toHaveTextContent("1 error");
    expect(document.getElementById("role-tab-a-count")).toBeNull();
  });

  it("translates fallbacks through labels", () => {
    render(
      <Tabs
        items={[{ id: "x", label: "X", errorCount: 2 }]}
        value="x"
        onChange={() => {}}
        ariaLabel="t"
        idPrefix="p"
        labels={{ errors: (n) => `${n} errores` }}
      />,
    );
    expect(document.getElementById("p-tab-x-errors")).toHaveTextContent("2 errores");
  });
});

describe("TabPanel", () => {
  it("keeps inactive panels mounted but hidden, so their state survives", () => {
    render(<Harness />);
    const generalField = screen.getByLabelText("general field") as HTMLInputElement;
    fireEvent.change(generalField, { target: { value: "typed" } });

    fireEvent.click(screen.getByRole("tab", { name: /Members/ }));
    const generalPanel = document.getElementById("role-panel-general")!;
    expect(generalPanel).toHaveAttribute("hidden");
    expect(generalPanel).toHaveClass("hidden");
    expect(generalPanel).toHaveAttribute("tabindex", "-1");

    fireEvent.click(screen.getByRole("tab", { name: "General" }));
    expect(generalPanel).not.toHaveAttribute("hidden");
    expect((screen.getByLabelText("general field") as HTMLInputElement).value).toBe("typed");
  });
});
