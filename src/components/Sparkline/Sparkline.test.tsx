import { render, screen } from "@testing-library/react";
import { Sparkline } from "./Sparkline";
import { sparklinePath } from "./sparklinePath";

describe("sparklinePath", () => {
  it("returns null for an empty or all-invalid series", () => {
    expect(sparklinePath([], 100, 36)).toBeNull();
    expect(sparklinePath([NaN, Infinity], 100, 36)).toBeNull();
  });

  it("maps min to the bottom padding and max to the top padding", () => {
    const p = sparklinePath([0, 10], 100, 36)!;
    // min → y = h - 2 = 34, max → y = 2; one cubic between them at x = 100.
    expect(p.line).toBe("M 0 34 C 50 34, 50 2, 100 2");
  });

  it("closes the area path down to the baseline", () => {
    const p = sparklinePath([0, 10], 100, 36)!;
    expect(p.area).toBe(`${p.line} L 100 36 L 0 36 Z`);
  });

  it("draws a flat series without dividing by zero", () => {
    const p = sparklinePath([5, 5, 5], 100, 36)!;
    expect(p.line).not.toMatch(/NaN|Infinity/);
    expect(p.line.startsWith("M 0 34")).toBe(true);
  });

  it("handles a single point", () => {
    expect(sparklinePath([7], 100, 36)!.line).toBe("M 0 34");
  });

  it("skips non-finite values", () => {
    expect(sparklinePath([0, NaN, 10], 100, 36)!.line).toBe(
      sparklinePath([0, 10], 100, 36)!.line,
    );
  });
});

describe("Sparkline", () => {
  it("renders nothing without data", () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("is decorative by default", () => {
    const { container } = render(<Sparkline data={[1, 3, 2]} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("is an image with a name when ariaLabel is given", () => {
    render(<Sparkline data={[1, 3, 2]} ariaLabel="Sign-ins, last 7 days" />);
    expect(screen.getByRole("img", { name: "Sign-ins, last 7 days" })).toBeInTheDocument();
  });

  it("gives each sparkline its own gradient id", () => {
    const { container } = render(
      <>
        <Sparkline data={[1, 2]} />
        <Sparkline data={[2, 1]} />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
    ids.forEach((id) => expect(id).toMatch(/^[a-zA-Z0-9_-]+$/));
    const areas = container.querySelectorAll('[data-part="area"]');
    expect(areas[0].getAttribute("fill")).toBe(`url(#${ids[0]})`);
  });

  it("omits the area and gradient when fill is false", () => {
    const { container } = render(<Sparkline data={[1, 2]} fill={false} />);
    expect(container.querySelector('[data-part="area"]')).toBeNull();
    expect(container.querySelector("linearGradient")).toBeNull();
    expect(container.querySelector('[data-part="line"]')).toHaveAttribute("stroke", "var(--color-primary-blue-default)");
  });

  it("uses the given size and color", () => {
    const { container } = render(<Sparkline data={[1, 2]} width={160} height={40} color="#ef4444" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 160 40");
    expect(container.querySelector('[data-part="line"]')).toHaveAttribute("stroke", "#ef4444");
  });
});
