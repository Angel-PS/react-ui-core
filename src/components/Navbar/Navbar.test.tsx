import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders the title and the actions slot", () => {
    render(
      <Navbar title="Dashboard" onMenuClick={() => {}} actions={<button>Bell</button>} />,
    );
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bell" })).toBeInTheDocument();
  });

  it("fires onMenuClick from the hamburger", () => {
    const onMenuClick = vi.fn();
    render(<Navbar title="X" onMenuClick={onMenuClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it("renders overlay children (e.g. a palette)", () => {
    render(
      <Navbar title="X" onMenuClick={() => {}}>
        <div data-testid="palette" />
      </Navbar>,
    );
    expect(screen.getByTestId("palette")).toBeInTheDocument();
  });
});
