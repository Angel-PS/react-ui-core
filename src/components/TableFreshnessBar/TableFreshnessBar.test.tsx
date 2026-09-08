import { render, screen, fireEvent } from "@testing-library/react";
import { TableFreshnessBar } from "./TableFreshnessBar";

const MINUTE = 60_000;

const dot = (container: HTMLElement) =>
  container.querySelector("span[aria-hidden='true'].rounded-full");

/**
 * The strip is the only place a user learns how old the rows on screen are.
 * Pinned here: the stamp tracks elapsed time (including the "just now" floor
 * and the stale threshold), the exact timestamp stays reachable, and the
 * control is a real, labelled, disable-while-busy button.
 */
describe("TableFreshnessBar", () => {
  it("reads 'just now' under a minute and shows a fresh dot", () => {
    const { container } = render(
      <TableFreshnessBar updatedAt={Date.now() - 5_000} onRefresh={() => {}} />,
    );

    expect(screen.getByText("Updated just now")).toBeInTheDocument();
    expect(dot(container)?.className).toContain("bg-emerald-500");
  });

  it("switches to the relative label and the stale dot past the threshold", () => {
    const { container } = render(
      <TableFreshnessBar
        updatedAt={Date.now() - 10 * MINUTE}
        onRefresh={() => {}}
      />,
    );

    expect(screen.getByText("Updated 10 minutes ago")).toBeInTheDocument();
    expect(dot(container)?.className).toContain("bg-accent-amber");
  });

  it("puts the exact timestamp in the tooltip and the accessible name", () => {
    render(
      <TableFreshnessBar
        updatedAt={new Date("2026-08-30T18:32:00Z").getTime()}
        timeZone="America/Santo_Domingo"
        onRefresh={() => {}}
      />,
    );

    const expected = "Last updated: 30-08-2026 14:32";
    expect(screen.getByTitle(expected)).toBeInTheDocument();
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe(
      `Refresh the table data. ${expected}`,
    );
  });

  it("says so when nothing has been fetched yet, and still allows a refresh", () => {
    render(<TableFreshnessBar onRefresh={() => {}} />);

    expect(screen.getByText("Not loaded yet")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("refreshes on click", () => {
    let calls = 0;
    render(
      <TableFreshnessBar updatedAt={Date.now()} onRefresh={() => calls++} />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(calls).toBe(1);
  });

  it("disables the button, spins the icon and announces while refreshing", () => {
    const { container } = render(
      <TableFreshnessBar
        updatedAt={Date.now()}
        isRefreshing
        onRefresh={() => {}}
      />,
    );

    expect(screen.getByRole("button")).toBeDisabled();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(container.querySelector("[aria-live='polite']")?.textContent).toBe(
      "Refreshing data…",
    );
  });

  it("localizes every string through `labels` and `locale`", () => {
    render(
      <TableFreshnessBar
        updatedAt={Date.now() - 10 * MINUTE}
        locale="es"
        onRefresh={() => {}}
        labels={{
          refresh: "Actualizar",
          updated: (when) => `Actualizado ${when}`,
        }}
      />,
    );

    expect(screen.getByText("Actualizado hace 10 minutos")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("title", "Actualizar");
  });
});
