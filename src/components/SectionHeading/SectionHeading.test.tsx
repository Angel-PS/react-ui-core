import { render, screen } from "@testing-library/react";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders the title and a decorative icon", () => {
    const { container } = render(<SectionHeading icon={faBuilding} title="General details" />);
    expect(screen.getByText("General details")).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("merges className onto the root", () => {
    const { container } = render(
      <SectionHeading icon={faBuilding} title="Billing" className="mb-0 mt-6" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("mt-6");
    expect(root.className).toContain("mb-0");
    expect(root.className).not.toContain("mb-4");
  });
});
