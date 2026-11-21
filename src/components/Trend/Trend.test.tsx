import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Trend } from "./Trend";

const chip = (ui: ReactElement) => render(ui).container.firstChild as HTMLElement;

describe("Trend", () => {
  it("shows a positive change with a plus sign, green tone and the vs suffix", () => {
    const el = chip(<Trend value={12.44} />);
    expect(el).toHaveTextContent("+12.4%vs previous");
    expect(el).toHaveAttribute("data-trend", "up");
    expect(el).toHaveClass("text-emerald-700", "dark:text-emerald-400");
  });

  it("shows a negative change without a plus sign, in red", () => {
    const el = chip(<Trend value={-3.06} />);
    expect(el).toHaveTextContent("-3.1%");
    expect(el.textContent).not.toContain("+");
    expect(el).toHaveAttribute("data-trend", "down");
    expect(el).toHaveClass("text-red-700", "dark:text-red-400");
  });

  it("treats zero as not-down", () => {
    const el = chip(<Trend value={0} />);
    expect(el).toHaveTextContent("+0.0%");
    expect(el).toHaveAttribute("data-trend", "up");
  });

  it.each([null, undefined, NaN, Infinity])("renders a neutral dash for %s", (value) => {
    const el = chip(<Trend value={value} />);
    expect(el.textContent).toBe("—");
    expect(el).not.toHaveAttribute("data-trend");
    expect(el).toHaveClass("text-gray-500");
  });

  it("hides the suffix with showVs={false}", () => {
    expect(chip(<Trend value={5} showVs={false} />).textContent).toBe("+5.0%");
  });

  it("honours decimals and translated labels", () => {
    expect(
      chip(<Trend value={5.256} decimals={2} labels={{ vsPrevious: "vs anterior" }} />),
    ).toHaveTextContent("+5.26%vs anterior");
  });

  it("merges className", () => {
    expect(chip(<Trend value={1} className="ml-2" />)).toHaveClass("ml-2");
  });
});
