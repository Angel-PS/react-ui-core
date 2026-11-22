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

  it("draws a status adornment right after the badge", () => {
    const rows: RowColumn[] = [
      {
        id: 1,
        columns: [
          { value: "Alice", accessor: "name" },
          {
            value: "active",
            accessor: "status",
            dataType: "status",
            adornment: <span data-testid="chip">Delivered</span>,
          },
        ],
      },
    ];
    render(<Table headers={headers} data={rows} />);
    const chip = screen.getByTestId("chip");
    expect(chip.closest("td")).toHaveTextContent("Active");
  });

  it("renders a plain cell's subValue as a second line", () => {
    const rows: RowColumn[] = [
      {
        id: 1,
        columns: [{ value: "Alice", accessor: "name", subValue: "alice@x.io" }],
      },
    ];
    render(<Table headers={headers} data={rows} />);
    expect(screen.getByText("alice@x.io")).toBeInTheDocument();
    expect(screen.getByText("Alice").closest("td")).toHaveTextContent(
      "Alicealice@x.io",
    );
  });

  it("renders date cells in the given time zone", () => {
    const rows: RowColumn[] = [
      {
        id: 1,
        columns: [
          { value: "2026-01-01T02:00:00Z", accessor: "name", dataType: "datetime" },
        ],
      },
    ];
    render(
      <Table headers={headers} data={rows} timeZone="America/Santo_Domingo" />,
    );
    // UTC-4: 02:00Z on Jan 1 is still Dec 31 at 22:00 locally.
    expect(screen.getByText("31-12-2025 22:00")).toBeInTheDocument();
  });

  it("colors a status from the statusStyles override", () => {
    const rows: RowColumn[] = [
      {
        id: 1,
        columns: [
          { value: "pin_assigned", accessor: "status", dataType: "status" },
        ],
      },
    ];
    render(
      <Table
        headers={headers}
        data={rows}
        statusStyles={{ pin_assigned: { badge: "badge-custom", dot: "dot-custom" } }}
      />,
    );
    expect(screen.getByText("Pin assigned").closest("span")).toHaveClass(
      "badge-custom",
    );
  });

  it("forwards pagination labels and page-size options to the footer", () => {
    render(
      <Table
        headers={headers}
        data={data}
        metadata={{ pagination: { count: 40, current: 1, size: 20 } }}
        rowsPerPageOptions={[20, 40]}
        paginationLabels={{
          rowsPerPage: "Filas por página",
          showing: ({ from, to, total }) => `${from}-${to} de ${total}`,
        }}
      />,
    );
    expect(screen.getByLabelText("Filas por página")).toBeInTheDocument();
    expect(screen.getByText("1-20 de 40")).toBeInTheDocument();
    expect(
      Array.from(
        (screen.getByRole("combobox") as HTMLSelectElement).options,
      ).map((o) => o.value),
    ).toEqual(["20", "40"]);
  });
});
