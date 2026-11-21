import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  CurrencyInput,
  clampNumber,
  formatCurrencyLive,
  parseCurrencyText,
} from "./CurrencyInput";
import type { CurrencyInputProps } from "./CurrencyInput";

function Controlled(
  props: Partial<CurrencyInputProps> & { initial?: number | null; spy?: (n: number) => void },
) {
  const { initial = null, spy, ...rest } = props;
  const [value, setValue] = useState<number | null>(initial);
  return (
    <CurrencyInput
      label="Amount"
      name="amount"
      {...rest}
      value={value}
      onChange={(n) => {
        spy?.(n);
        setValue(n);
      }}
    />
  );
}

describe("CurrencyInput helpers", () => {
  it("parseCurrencyText keeps digits and the first dot", () => {
    expect(parseCurrencyText("1,234.5")).toEqual({ numeric: 1234.5, rawText: "1234.5" });
    expect(parseCurrencyText("RD$ 12.3.4")).toEqual({ numeric: 12.34, rawText: "12.34" });
    expect(parseCurrencyText("")).toEqual({ numeric: 0, rawText: "" });
    expect(parseCurrencyText(".")).toEqual({ numeric: 0, rawText: "." });
  });

  it("formatCurrencyLive groups the integer part without padding decimals", () => {
    expect(formatCurrencyLive("1234567")).toBe("1,234,567");
    expect(formatCurrencyLive("1234.5")).toBe("1,234.5");
    expect(formatCurrencyLive("0005")).toBe("5");
    expect(formatCurrencyLive("")).toBe("");
  });

  it("clampNumber honours min and max", () => {
    expect(clampNumber(5, 10, 100)).toBe(10);
    expect(clampNumber(500, 10, 100)).toBe(100);
    expect(clampNumber(50, 10, 100)).toBe(50);
    expect(clampNumber(50)).toBe(50);
  });
});

describe("CurrencyInput", () => {
  it("links the label to the field and formats the initial value", () => {
    render(<Controlled initial={1250} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    expect(input.value).toBe("1,250.00");
    expect(input).toHaveAttribute("inputmode", "decimal");
  });

  it("renders an empty field for a null value", () => {
    render(<Controlled initial={null} />);
    expect((screen.getByLabelText("Amount") as HTMLInputElement).value).toBe("");
  });

  it("groups digits live and reports the number", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "15000.5" } });
    expect(input.value).toBe("15,000.5");
    expect(spy).toHaveBeenLastCalledWith(15000.5);
  });

  it("formats to the configured decimals on blur", () => {
    render(<Controlled decimals={3} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "1234.5" } });
    fireEvent.blur(input);
    expect(input.value).toBe("1,234.500");
  });

  it("clamps above maxValue while typing", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} maxValue={100} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "250" } });
    expect(spy).toHaveBeenLastCalledWith(100);
    expect(input.value).toBe("100");
  });

  it("clamps below minValue", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} minValue={1} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "0.5" } });
    expect(spy).toHaveBeenLastCalledWith(1);
    fireEvent.blur(input);
    expect(input.value).toBe("1.00");
  });

  it("an emptied field reports 0 and shows 0.00 after blur", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} initial={42} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "" } });
    expect(spy).toHaveBeenLastCalledWith(0);
    expect(input.value).toBe("");
    fireEvent.blur(input);
    expect(input.value).toBe("0.00");
  });

  it("re-syncs from an outside value change while not focused", () => {
    const { rerender } = render(
      <CurrencyInput label="Amount" name="a" value={10} onChange={() => {}} />,
    );
    rerender(<CurrencyInput label="Amount" name="a" value={2500} onChange={() => {}} />);
    expect((screen.getByLabelText("Amount") as HTMLInputElement).value).toBe("2,500.00");
  });

  it("wires error and hint through aria", () => {
    render(
      <CurrencyInput
        label="Amount"
        name="amt"
        value={0}
        onChange={() => {}}
        error="Too low"
        hint="Before tax"
      />,
    );
    const input = screen.getByLabelText("Amount");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "amt-error amt-hint");
    expect(screen.getByRole("alert")).toHaveTextContent("Too low");
  });

  it("shows a skeleton while loading", () => {
    const { container } = render(
      <CurrencyInput label="Amount" value={1} onChange={() => {}} loading />,
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });

  it("marks required with an asterisk", () => {
    render(<CurrencyInput label="Amount" value={1} onChange={() => {}} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
