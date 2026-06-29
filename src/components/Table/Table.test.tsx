import { render, screen, fireEvent } from "@testing-library/react";
import { Table } from "./Table";
import type { HeaderColumn, RowColumn } from "../../types";

const headers: HeaderColumn[] = [
  { value: "Name", accessor: "name", sortKey: "name" },
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

describe("Table", () => {
  it("shows the empty state", () => {
    render(<Table headers={headers} data={[]} />);
    expect(screen.getByText("No records")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<Table headers={headers} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders a status cell with a humanized label", () => {
    render(<Table headers={headers} data={data} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("cycles the controlled sort: key → -key → null", () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <Table headers={headers} data={data} sort={null} onSortChange={onSortChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /sort ascending/i }));
    expect(onSortChange).toHaveBeenLastCalledWith("name");

    rerender(
      <Table headers={headers} data={data} sort="name" onSortChange={onSortChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /sort descending/i }));
    expect(onSortChange).toHaveBeenLastCalledWith("-name");

    rerender(
      <Table headers={headers} data={data} sort="-name" onSortChange={onSortChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /clear sort/i }));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });
});
