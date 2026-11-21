import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("is a named switch that reports its state", () => {
    const { rerender } = render(
      <Switch checked={false} onChange={() => {}} aria-label="Email alerts" />,
    );
    const sw = screen.getByRole("switch", { name: "Email alerts" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAttribute("type", "button");

    rerender(<Switch checked onChange={() => {}} aria-label="Email alerts" />);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the next state", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Switch checked={false} onChange={onChange} aria-label="x" />,
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenLastCalledWith(true);

    rerender(<Switch checked onChange={onChange} aria-label="x" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("does not toggle while disabled", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} disabled aria-label="x" />);
    const sw = screen.getByRole("switch");
    expect(sw).toBeDisabled();
    fireEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("is labelled by an external <label htmlFor>", () => {
    render(
      <>
        <label htmlFor="sw-2fa">Require two-factor</label>
        <Switch id="sw-2fa" checked={false} onChange={() => {}} />
      </>,
    );
    expect(
      screen.getByRole("switch", { name: "Require two-factor" }),
    ).toBeInTheDocument();
  });

  it("lets a consumer onClick cancel the toggle", () => {
    const onChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={onChange}
        onClick={(e) => e.preventDefault()}
        aria-label="x"
      />,
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Switch ref={ref} checked onChange={() => {}} aria-label="x" className="ml-2" />,
    );
    expect(ref.current).toBe(screen.getByRole("switch"));
    expect(ref.current).toHaveClass("ml-2", "bg-primary-blue-default");
  });
});
