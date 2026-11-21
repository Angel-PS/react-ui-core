import { render, screen } from "@testing-library/react";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("is a polite status region with title and description", () => {
    render(
      <EmptyState
        icon={faInbox}
        title="No applications yet"
        description="Register an application to get started."
      />,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("No applications yet");
    expect(status).toHaveTextContent("Register an application to get started.");
  });

  it("renders the action", () => {
    render(<EmptyState title="Nothing" action={<button type="button">New</button>} />);
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("omits the icon and description when not given", () => {
    const { container } = render(<EmptyState title="Nothing" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.getByRole("status").querySelectorAll("p")).toHaveLength(1);
  });

  it("uses tighter padding for size sm", () => {
    render(<EmptyState title="Nothing" size="sm" />);
    expect(screen.getByRole("status").className).toContain("py-8");
    expect(screen.getByRole("status").className).not.toContain("py-10");
  });

  it("carries the recessed surface in both themes", () => {
    render(<EmptyState title="Nothing" />);
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("bg-gray-50");
    expect(cls).toContain("dark:bg-slate-800");
  });
});
