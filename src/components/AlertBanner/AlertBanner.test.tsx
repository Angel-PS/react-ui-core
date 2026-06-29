import { render, screen, fireEvent } from "@testing-library/react";
import { AlertBanner } from "./AlertBanner";

describe("AlertBanner", () => {
  it("renders the message", () => {
    render(<AlertBanner message="Trial expires in 5 days" />);
    expect(screen.getByText("Trial expires in 5 days")).toBeInTheDocument();
  });

  it("fires the action", () => {
    const onClick = vi.fn();
    render(
      <AlertBanner message="Renew now" action={{ label: "View plan", onClick }} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /view plan/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows a dismiss button only when dismissible", () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<AlertBanner message="x" />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
    rerender(<AlertBanner message="x" dismissible onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
