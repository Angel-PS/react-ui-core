import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders the showing summary", () => {
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText(/Showing 1–25 of 100/)).toBeInTheDocument();
  });

  it("calls onPageChange when a page button is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={25}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /go to page 2/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables Previous on the first page", () => {
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("calls onPageSizeChange with a number", () => {
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={25}
        onPageChange={() => {}}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  const optionValues = () =>
    Array.from(
      (screen.getByRole("combobox") as HTMLSelectElement).options,
    ).map((o) => Number(o.value));

  it("offers 10 rows per page by default and shows it as selected", () => {
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={10}
        onPageChange={() => {}}
      />,
    );
    expect(optionValues()).toEqual([10, 25, 50, 100, 200]);
    expect(screen.getByRole("combobox")).toHaveValue("10");
  });

  it("shows an off-list page size as itself instead of the first option", () => {
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={30}
        onPageChange={() => {}}
      />,
    );
    expect(optionValues()).toEqual([10, 25, 30, 50, 100, 200]);
    expect(screen.getByRole("combobox")).toHaveValue("30");
  });

  it("adds an off-list size to custom rowsPerPageOptions too", () => {
    render(
      <Pagination
        count={100}
        currentPage={1}
        pageSize={15}
        rowsPerPageOptions={[20, 40]}
        onPageChange={() => {}}
      />,
    );
    expect(optionValues()).toEqual([15, 20, 40]);
  });
});
