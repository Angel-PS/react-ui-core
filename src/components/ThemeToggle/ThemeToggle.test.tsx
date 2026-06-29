import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("labels the action based on the current theme", () => {
    const { rerender } = render(<ThemeToggle isDark={false} onToggle={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
    rerender(<ThemeToggle isDark onToggle={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("fires onToggle on click", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle isDark={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
