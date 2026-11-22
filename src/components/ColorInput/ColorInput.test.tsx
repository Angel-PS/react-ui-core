import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ColorInput, isHexColor, normalizeHex } from "./ColorInput";

function Controlled({ initial = "#4061A8", spy }: { initial?: string; spy?: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <ColorInput
      label="Brand color"
      name="brand"
      value={value}
      onChange={(v) => {
        spy?.(v);
        setValue(v);
      }}
    />
  );
}

describe("ColorInput helpers", () => {
  it("normalizeHex adds a missing # and trims", () => {
    expect(normalizeHex(" 4061a8 ")).toBe("#4061a8");
    expect(normalizeHex("#fff")).toBe("#fff");
    expect(normalizeHex("   ")).toBe("");
  });

  it("isHexColor accepts #RGB and #RRGGBB only", () => {
    expect(isHexColor("#fff")).toBe(true);
    expect(isHexColor("#4061A8")).toBe(true);
    expect(isHexColor("#12G")).toBe(false);
    expect(isHexColor("4061A8")).toBe(false);
    expect(isHexColor("#4061A")).toBe(false);
  });
});

describe("ColorInput", () => {
  it("links the label to the text field", () => {
    render(<Controlled />);
    expect(screen.getByLabelText("Brand color")).toHaveValue("#4061A8");
  });

  it("typing a hex without # emits it with #", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} initial="" />);
    fireEvent.change(screen.getByLabelText("Brand color"), { target: { value: "ff0000" } });
    expect(spy).toHaveBeenLastCalledWith("#ff0000");
    expect(screen.getByLabelText("Brand color")).toHaveValue("#ff0000");
  });

  it("opens the presets popover from the swatch and picking a preset emits upper-case hex", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    const trigger = screen.getByRole("button", { name: "Choose a color" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Color presets" });
    expect(dialog).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "#EF4444" }));
    expect(spy).toHaveBeenLastCalledWith("#EF4444");
    expect(screen.getByRole("button", { name: "#EF4444" })).toHaveAttribute("aria-pressed", "true");
  });

  it("the native picker emits an upper-case hex", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    fireEvent.click(screen.getByRole("button", { name: "Choose a color" }));
    fireEvent.change(screen.getByLabelText("Custom"), { target: { value: "#00ff00" } });
    expect(spy).toHaveBeenLastCalledWith("#00FF00");
  });

  it("closes on Escape and marks the key as consumed", () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Choose a color" }));
    const dialog = screen.getByRole("dialog");
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    act(() => {
      dialog.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on a click outside", () => {
    render(
      <div>
        <Controlled />
        <button type="button">outside</button>
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Choose a color" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    render(<ColorInput label="Brand color" name="b" value="#4061A8" disabled />);
    fireEvent.click(screen.getByRole("button", { name: "Choose a color" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wires error and hint through aria and accepts custom labels", () => {
    render(
      <ColorInput
        label="Brand color"
        name="brand2"
        value="#12G"
        error="Enter a hex color like #4061A8"
        hint="Used in emails"
        labels={{ openPresets: "Elegir color" }}
      />,
    );
    const input = screen.getByLabelText("Brand color");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "brand2-error brand2-hint");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a hex color like #4061A8");
    expect(screen.getByRole("button", { name: "Elegir color" })).toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    const { container } = render(<ColorInput label="Brand color" loading />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });
});
