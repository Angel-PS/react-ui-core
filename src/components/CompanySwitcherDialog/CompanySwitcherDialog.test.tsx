import { fireEvent, render, screen, within } from "@testing-library/react";
import { CompanySwitcherDialog, matchesCompany } from "./CompanySwitcherDialog";
import type { CompanySwitcherDialogProps } from "./CompanySwitcherDialog";
import type { CompanyOption } from "../Sidebar/Sidebar.types";

const companies: CompanyOption[] = [
  { id: "1", primaryLabel: "Acme Foods", secondaryLabel: "RNC 101000001" },
  { id: "2", primaryLabel: "Compañía Norte", secondaryLabel: "RNC 102000002" },
  { id: "3", primaryLabel: "Globex Logistics", secondaryLabel: "RNC 103000003" },
];

const setup = (props: Partial<CompanySwitcherDialogProps> = {}) => {
  const onClose = vi.fn();
  const onSelect = vi.fn();
  render(
    <CompanySwitcherDialog
      open
      onClose={onClose}
      onSelect={onSelect}
      companies={companies}
      activeCompanyId="1"
      {...props}
    />,
  );
  const input = screen.getByRole("combobox");
  return { onClose, onSelect, input };
};

const optionNames = () =>
  screen.getAllByRole("option").map((o) => o.textContent ?? "");

describe("matchesCompany", () => {
  it("ignores case and accents across both lines", () => {
    expect(matchesCompany(companies[1], "compania")).toBe(true);
    expect(matchesCompany(companies[1], "NORTE")).toBe(true);
    expect(matchesCompany(companies[0], "101000001")).toBe(true);
    expect(matchesCompany(companies[0], "globex")).toBe(false);
    expect(matchesCompany(companies[0], "  ")).toBe(true);
  });
});

describe("CompanySwitcherDialog", () => {
  it("renders nothing while closed", () => {
    render(
      <CompanySwitcherDialog open={false} onClose={() => {}} onSelect={() => {}} companies={companies} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("portals a labelled modal dialog to document.body and focuses the search", () => {
    const { container } = render(<div id="host" />);
    const { input } = setup();
    const dialog = screen.getByRole("dialog", { name: "Switch company" });
    expect(input).toHaveAccessibleName("Search company");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  it("marks the current company and shows the result count", () => {
    setup();
    const current = screen.getAllByRole("option").find((o) => o.dataset.current === "true");
    expect(current).toHaveTextContent("Acme Foods");
    expect(screen.getAllByText("3 companies").length).toBeGreaterThan(0);
  });

  it("filters client-side ignoring accents", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "compania" } });
    expect(optionNames()).toEqual([expect.stringContaining("Compañía Norte")]);
  });

  it("shows the empty state with the query and hint", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "zenith" } });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getAllByText("No companies match “zenith”").length).toBeGreaterThan(0);
    expect(screen.getByText("Check the trade name, or try the RNC.")).toBeInTheDocument();
  });

  it("arrow keys move the highlighted row (wrapping) and Enter selects it", () => {
    const { input, onSelect } = setup();
    const options = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[1].id);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveAttribute("aria-activedescendant", options[2].id);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(companies[2]);
  });

  it("clicking a row selects it", () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByText("Globex Logistics"));
    expect(onSelect).toHaveBeenCalledWith(companies[2]);
  });

  it("Escape closes the dialog", () => {
    const { onClose } = setup();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a mousedown on the backdrop closes it", () => {
    const { onClose } = setup();
    fireEvent.mouseDown(screen.getByTestId("company-switcher-backdrop"), { button: 0 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("offers the deselect row first when onDeselect is given, and hides it while searching", () => {
    const onDeselect = vi.fn();
    const { input } = setup({ onDeselect, activeCompanyId: null });
    const first = screen.getAllByRole("option")[0];
    expect(first).toHaveTextContent("No company");
    expect(first).toHaveTextContent("Platform only");
    expect(first.dataset.current).toBe("true");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onDeselect).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: "acme" } });
    expect(screen.queryByText("No company")).not.toBeInTheDocument();
  });

  it("groups recents above all companies and prefers the live copy", () => {
    setup({
      recentCompanies: [{ id: "3", primaryLabel: "Globex (old name)" }],
    });
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByText("Recent")).toBeInTheDocument();
    expect(within(listbox).getByText("All companies")).toBeInTheDocument();
    const names = optionNames();
    expect(names[0]).toContain("Globex Logistics");
    expect(names).toHaveLength(3);
    expect(screen.queryByText("Globex (old name)")).not.toBeInTheDocument();
  });

  it("arrowing to the last row requests the next page when hasMore", () => {
    const onLoadMore = vi.fn();
    const { input } = setup({ hasMore: true, onLoadMore });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onLoadMore).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("scrolling to the end requests the next page", () => {
    const onLoadMore = vi.fn();
    setup({ hasMore: true, onLoadMore });
    const listbox = screen.getByRole("listbox");
    Object.defineProperty(listbox, "scrollHeight", { value: 500, configurable: true });
    Object.defineProperty(listbox, "clientHeight", { value: 300, configurable: true });
    Object.defineProperty(listbox, "scrollTop", { value: 180, configurable: true });
    fireEvent.scroll(listbox);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not load more while a page is already loading", () => {
    const onLoadMore = vi.fn();
    const { input } = setup({ hasMore: true, isLoadingMore: true, onLoadMore });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onLoadMore).not.toHaveBeenCalled();
    expect(screen.getByText("Loading more companies…")).toBeInTheDocument();
  });

  it("server mode reports the query and does not filter locally", () => {
    const onQueryChange = vi.fn();
    const { input } = setup({ onQueryChange, query: "zz", matchCount: 40 });
    expect(input).toHaveValue("zz");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getAllByText("40 companies").length).toBeGreaterThan(0);
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(onQueryChange).toHaveBeenCalledWith("zzz");
  });

  it("shows skeleton rows while loading and announces a search in flight", () => {
    setup({ isLoading: true, isSearching: true });
    expect(screen.getByTestId("company-switcher-skeleton")).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getAllByText("Searching…").length).toBeGreaterThan(0);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
  });

  it("accepts translated labels", () => {
    setup({
      labels: { title: "Cambiar empresa", inputAria: "Buscar empresa", resultCount: (n) => `${n} empresas` },
    });
    expect(screen.getByRole("dialog", { name: "Cambiar empresa" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Buscar empresa" })).toBeInTheDocument();
    expect(screen.getAllByText("3 empresas").length).toBeGreaterThan(0);
  });
});
