import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button, type ButtonProps } from "./Button";

type Variant = NonNullable<ButtonProps["variant"]>;

describe("Button", () => {
  it("defaults to the primary variant", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "bg-primary-blue-default",
    );
  });

  it("forwards its ref to the <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it.each<[Variant, string]>([
    ["segment-active", "bg-white"],
    ["segment-inactive", "bg-transparent"],
    ["segment-brand-active", "text-gray-900"],
    ["segment-brand-inactive", "text-white"],
    ["link", "hover:underline"],
    ["chip", "rounded-full"],
    ["fab", "size-14"],
  ])("renders the %s variant", (variant, expected) => {
    render(<Button variant={variant}>x</Button>);
    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it("segment variants are not built on the heavy base box (no px-4 / py-2.5)", () => {
    render(<Button variant="segment-active">Week</Button>);
    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("px-4");
    expect(button).not.toHaveClass("py-2.5");
  });

  it("chip lets the caller's tone win over its own colours (tailwind-merge)", () => {
    render(
      <Button variant="chip" className="bg-amber-50 text-amber-700">
        Pending
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-amber-50", "text-amber-700");
  });

  it("keeps the opacity-based disabled style on primary and cancel", () => {
    const { rerender } = render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("disabled:opacity-50");
    rerender(
      <Button variant="cancel" disabled>
        Delete
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("disabled:opacity-50");
  });

  it("is disabled and busy while loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not force a type (the native default is kept)", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("type");
  });
});
