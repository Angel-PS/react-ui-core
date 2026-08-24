import { render, screen, fireEvent } from "@testing-library/react";
import { MaintenanceLayout } from "./MaintenanceLayout";
import type { HeaderColumn, RowColumn, TableAction } from "../../types";

const headers: HeaderColumn[] = [
  { value: "Name", accessor: "name" },
  { value: "Status", accessor: "status" },
];

const data: RowColumn[] = [
  {
    id: 1,
    columns: [
      { value: "Alice", accessor: "name" },
      { value: "active", accessor: "status", dataType: "status" },
    ],
  },
];

const extraActions: TableAction[] = [
  { label: "Change plan", icon: null, onClick: () => {} },
];

const renderLayout = (props: Partial<Record<string, unknown>> = {}) =>
  render(
    <MaintenanceLayout
      maintenanceType="page"
      createPath="/new"
      editPath="/edit"
      headers={headers}
      data={data}
      canDelete
      onDelete={() => {}}
      extraActions={extraActions}
      {...props}
    />,
  );

/** Opens the row kebab and returns the menu item labels, in render order. */
const openRowMenu = () => {
  fireEvent.click(screen.getByRole("button", { name: /actions/i }));
  const menu = document.querySelector('div[data-table-menu="true"]');
  return Array.from(menu?.querySelectorAll("button") ?? []).map((b) =>
    b.textContent?.trim(),
  );
};

describe("MaintenanceLayout", () => {
  it("renders the built-in delete last, after the consumer's extra actions", () => {
    renderLayout();
    expect(openRowMenu()).toEqual(["Edit", "Change plan", "Delete"]);
  });

  it("keeps delete last on the right-click context menu too", () => {
    renderLayout();
    fireEvent.contextMenu(screen.getByText("Alice"));
    const menu = document.querySelector('div[data-table-context="true"]');
    const labels = Array.from(menu?.querySelectorAll("button") ?? []).map((b) =>
      b.textContent?.trim(),
    );
    expect(labels).toEqual(["Edit", "Change plan", "Delete"]);
  });

  it("still opens the delete confirmation from the reordered item", () => {
    renderLayout();
    openRowMenu();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete record")).toBeInTheDocument();
  });
});
