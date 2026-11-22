import { act, fireEvent, render, screen } from "@testing-library/react";
import { MaintenanceLayout, type MaintenanceLayoutProps } from "./MaintenanceLayout";
import type { FilterController, FilterDef } from "../Filters";
import type { HeaderColumn, RowColumn } from "../../types";

const headers: HeaderColumn[] = [
  { value: "Name", accessor: "name", locked: true },
  { value: "Email", accessor: "email" },
  { value: "Address", accessor: "address", defaultHidden: true },
];

const rows: RowColumn[] = [
  {
    id: 1,
    columns: [
      { value: "Alice", accessor: "name" },
      { value: "alice@acme.com", accessor: "email" },
      { value: "Main St 1", accessor: "address" },
    ],
  },
];

const renderLayout = (props: Partial<MaintenanceLayoutProps> = {}) =>
  render(
    <MaintenanceLayout
      maintenanceType="page"
      createPath="/new"
      editPath="/edit"
      headers={headers}
      data={rows}
      canCreate={false}
      {...(props as object)}
    />,
  );

const columnHeaders = () =>
  screen.getAllByRole("columnheader").map((th) => th.textContent);

describe("MaintenanceLayout — column preferences", () => {
  it("hides optional columns even when the user never saved a layout", () => {
    renderLayout({ tableKey: "customers" });
    expect(columnHeaders()).toEqual(
      expect.arrayContaining(["Name", "Email"]),
    );
    expect(columnHeaders()).not.toContain("Address");
    expect(screen.queryByText("Main St 1")).not.toBeInTheDocument();
  });

  it("shows every column without a tableKey (manager off)", () => {
    renderLayout();
    expect(columnHeaders()).toContain("Address");
  });
});

describe("MaintenanceLayout — forwarded labels", () => {
  const filterDefs: FilterDef[] = [
    {
      kind: "select",
      key: "branch",
      label: "Branch",
      options: [{ value: "", label: "All" }],
    },
  ];
  const filters: FilterController = {
    filters: filterDefs,
    values: {},
    setValue: vi.fn(),
    setMany: vi.fn(),
    clear: vi.fn(),
  };

  it("translates the column manager, filters, pagination and search toolbar", () => {
    renderLayout({
      tableKey: "customers",
      filters,
      searchBar: { totalCount: 40 },
      metadata: { pagination: { count: 40, current: 1, size: 10 } },
      columnManagerLabels: { button: "Columnas" },
      filtersLabels: { button: "Filtros" },
      paginationLabels: { rowsPerPage: "Filas por página" },
      labels: {
        searchPlaceholder: "Buscar…",
        resultCount: (n) => `${n} resultados`,
      },
    });
    expect(screen.getByRole("button", { name: /columnas/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filtros/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Filas por página")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar…")).toBeInTheDocument();
    expect(screen.getByText("40 resultados")).toBeInTheDocument();
  });

  it("lets searchBar.placeholder win over labels.searchPlaceholder", () => {
    renderLayout({
      searchBar: { placeholder: "Find customers" },
      labels: { searchPlaceholder: "Buscar…" },
    });
    expect(screen.getByPlaceholderText("Find customers")).toBeInTheDocument();
  });
});

describe("MaintenanceLayout — manual refresh", () => {
  const refreshButton = () =>
    screen.getByRole("button", { name: /refresh the table data/i });
  const tableBody = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[aria-busy]");

  it("tracks a Promise-returning refresh: rows stay, dimmed, repeat clicks ignored", async () => {
    let resolve!: () => void;
    const onRefresh = vi.fn(
      () => new Promise<void>((r) => (resolve = () => r())),
    );
    const { container } = renderLayout({
      // The data layer is also fetching — rows must still not turn into skeletons.
      isLoading: true,
      refresh: { updatedAt: Date.now(), onRefresh },
    });
    // Before the click a fetch shows skeletons.
    expect(container.querySelector(".skeleton")).not.toBeNull();

    fireEvent.click(refreshButton());
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(tableBody(container)).not.toBeNull();
    expect(container.querySelector(".skeleton")).toBeNull();
    expect(screen.getByText("Alice")).toBeInTheDocument();

    fireEvent.click(refreshButton());
    expect(onRefresh).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve();
    });
    expect(tableBody(container)).toBeNull();
    fireEvent.click(refreshButton());
    expect(onRefresh).toHaveBeenCalledTimes(2);
  });

  it("still honours an explicit refresh.isRefreshing", () => {
    const onRefresh = vi.fn();
    const { container } = renderLayout({
      refresh: { updatedAt: Date.now(), onRefresh, isRefreshing: true },
    });
    expect(tableBody(container)).not.toBeNull();
    expect(refreshButton()).toBeDisabled();
  });

  it("clears the busy state when the refresh Promise rejects", async () => {
    let reject!: () => void;
    const onRefresh = vi.fn(
      () => new Promise<void>((_, rj) => (reject = () => rj(new Error("x")))),
    );
    const { container } = renderLayout({
      refresh: { updatedAt: Date.now(), onRefresh },
    });
    fireEvent.click(refreshButton());
    expect(tableBody(container)).not.toBeNull();
    await act(async () => {
      reject();
    });
    expect(tableBody(container)).toBeNull();
  });
});

describe("MaintenanceLayout — search debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("commits the search once after the debounce, keeping the typed text", () => {
    const onSearchChange = vi.fn();
    renderLayout({
      searchBar: {},
      searchValue: "",
      onSearchChange,
      searchDebounceMs: 400,
    });
    const input = screen.getByPlaceholderText("Search…");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "al" } });
    expect(input).toHaveValue("al");
    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith("al");
  });

  it("clears at once and mirrors an outside reset into the input", () => {
    const onSearchChange = vi.fn();
    const { rerender } = render(
      <MaintenanceLayout
        maintenanceType="page"
        createPath="/new"
        editPath="/edit"
        headers={headers}
        data={rows}
        canCreate={false}
        searchBar={{}}
        searchValue="bob"
        onSearchChange={onSearchChange}
        searchDebounceMs={400}
      />,
    );
    const input = screen.getByPlaceholderText("Search…");
    expect(input).toHaveValue("bob");

    rerender(
      <MaintenanceLayout
        maintenanceType="page"
        createPath="/new"
        editPath="/edit"
        headers={headers}
        data={rows}
        canCreate={false}
        searchBar={{}}
        searchValue=""
        onSearchChange={onSearchChange}
        searchDebounceMs={400}
      />,
    );
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "x" } });
    fireEvent.click(input.parentElement!.querySelector("button")!);
    expect(onSearchChange).toHaveBeenLastCalledWith("");
    act(() => {
      vi.advanceTimersByTime(400);
    });
    // The pending "x" was cancelled by the clear.
    expect(onSearchChange).not.toHaveBeenCalledWith("x");
  });

  it("calls onSearchChange on every keystroke without a debounce", () => {
    const onSearchChange = vi.fn();
    renderLayout({ searchBar: {}, searchValue: "", onSearchChange });
    fireEvent.change(screen.getByPlaceholderText("Search…"), {
      target: { value: "a" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("a");
  });
});
