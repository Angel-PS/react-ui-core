import { render, screen, fireEvent } from "@testing-library/react";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Card } from "./Card";
import { SettingRow } from "./SettingRow";

describe("Card — theming, action and compact variant", () => {
  it("paints with semantic tokens so a re-themed app re-themes it", () => {
    const { container } = render(<Card title="T">body</Card>);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("bg-card");
    expect(cls).toContain("border-border");
    expect(cls).not.toMatch(/bg-white|border-gray-|slate-/);
  });

  it("renders the header action slot", () => {
    render(
      <Card title="Revenue" action={<button type="button">This month</button>}>
        body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "This month" })).toBeInTheDocument();
  });

  it("compact variant: one padded surface, small title, body fills", () => {
    const { container } = render(
      <Card variant="compact" title="Sign-ins" description="Last 30 days" action={<span>a</span>}>
        body
      </Card>,
    );
    const section = container.firstElementChild as HTMLElement;
    expect(section.className).toContain("p-6");
    expect(screen.getByRole("heading", { name: "Sign-ins" }).className).toContain("text-sm");
    expect(screen.getByText("body").className).toContain("flex-1");
  });
});

describe("Card", () => {
  it("renders title, description, body and footer", () => {
    render(
      <Card
        id="security"
        title="Sign-in security"
        description="How accounts are protected."
        footer={<button type="button">Save</button>}
      >
        <p>Body</p>
      </Card>,
    );
    const region = screen.getByRole("heading", { name: "Sign-in security" }).closest("section");
    expect(region).toHaveAttribute("id", "security");
    expect(screen.getByText("How accounts are protected.")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders a FontAwesome icon definition as an svg", () => {
    const { container } = render(
      <Card title="T" icon={faShieldHalved}>
        x
      </Card>,
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders a node icon as given", () => {
    render(
      <Card title="T" icon={<span data-testid="glyph">★</span>}>
        x
      </Card>,
    );
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("omits the footer row and icon tile when not given", () => {
    const { container } = render(<Card title="T">x</Card>);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelectorAll("section > div")).toHaveLength(2);
  });

  it("merges bodyClassName over the default padding", () => {
    render(
      <Card title="T" bodyClassName="p-0">
        <span>inner</span>
      </Card>,
    );
    const body = screen.getByText("inner").parentElement as HTMLElement;
    expect(body.className).toContain("p-0");
    expect(body.className).not.toContain("px-6");
  });
});

describe("SettingRow", () => {
  it("labels its control through htmlFor", () => {
    render(
      <SettingRow title="Session length" description="Idle timeout" htmlFor="len">
        <input id="len" />
      </SettingRow>,
    );
    const input = screen.getByLabelText("Session length");
    expect(input).toHaveAttribute("id", "len");
    expect(screen.getByText("Idle timeout")).toBeInTheDocument();
  });

  it("clicking the title focuses a labelled switch", () => {
    const onClick = vi.fn();
    render(
      <SettingRow title="Email alerts" htmlFor="alerts" compact>
        <button id="alerts" type="button" role="switch" aria-checked="false" onClick={onClick} />
      </SettingRow>,
    );
    fireEvent.click(screen.getByText("Email alerts"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("overrides the global label base styles", () => {
    render(
      <SettingRow title="Name">
        <input />
      </SettingRow>,
    );
    const label = screen.getByText("Name");
    expect(label.tagName).toBe("LABEL");
    expect(label.className).toContain("mb-0");
    expect(label.className).toContain("font-medium");
  });

  it("gives the control a fixed width unless compact", () => {
    const { rerender } = render(
      <SettingRow title="Name">
        <input data-testid="ctl" />
      </SettingRow>,
    );
    expect((screen.getByTestId("ctl").parentElement as HTMLElement).className).toContain("sm:w-64");
    rerender(
      <SettingRow title="Name" compact>
        <input data-testid="ctl" />
      </SettingRow>,
    );
    expect((screen.getByTestId("ctl").parentElement as HTMLElement).className).not.toContain(
      "sm:w-64",
    );
  });
});
