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
});
