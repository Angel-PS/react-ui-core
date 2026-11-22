import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("is an alert with the message and a default retry label", () => {
    render(<ErrorState message="We couldn't load the companies." onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("We couldn't load the companies.");
    expect(screen.getByRole("button", { name: "Try again" })).toHaveAttribute("type", "button");
  });

  it("calls onRetry", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Failed" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("disables the button while retrying", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Failed" onRetry={onRetry} isRetrying />);
    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onRetry).not.toHaveBeenCalled();
  });

  it("accepts a translated retry label", () => {
    render(<ErrorState message="Falló" onRetry={() => {}} labels={{ retry: "Reintentar" }} />);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("hides the retry button when there is no onRetry", () => {
    render(<ErrorState message="Could not load" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("draws no card surface with variant='plain'", () => {
    render(<ErrorState message="Could not load" variant="plain" />);
    const cls = screen.getByRole("alert").className;
    expect(cls).not.toContain("bg-card");
    expect(cls).not.toContain("border");
  });
});
