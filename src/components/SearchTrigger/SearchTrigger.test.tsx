import { render, screen, fireEvent } from "@testing-library/react";
import { SearchTrigger } from "./SearchTrigger";

describe("SearchTrigger", () => {
  it("renders the desktop label and shortcut", () => {
    render(<SearchTrigger onOpen={() => {}} labels={{ trigger: "Buscar…", shortcut: "Ctrl K" }} />);
    expect(screen.getByText("Buscar…")).toBeInTheDocument();
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
  });

  it("calls onOpen when clicked", () => {
    const onOpen = vi.fn();
    render(<SearchTrigger onOpen={onOpen} />);
    // Two buttons (desktop pill + mobile icon) — clicking either opens.
    fireEvent.click(screen.getAllByRole("button", { name: "Open search" })[0]);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
