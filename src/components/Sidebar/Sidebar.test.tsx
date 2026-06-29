import { render, screen, fireEvent } from "@testing-library/react";
import { faBox, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "./Sidebar";
import { CompanySwitcher } from "./CompanySwitcher";
import { isPathActive, type SidebarGroup } from "./Sidebar.types";

const groups: SidebarGroup[] = [
  {
    key: "operations",
    title: "Operations",
    items: [
      { key: "dashboard", label: "Dashboard", icon: faGaugeHigh, path: "/dashboard", end: true },
      { key: "products", label: "Products", icon: faBox, path: "/products" },
    ],
  },
];

const baseProps = {
  groups,
  activePath: "/dashboard",
  onNavigate: () => {},
  isCollapsed: false,
  isMobileOpen: false,
  onToggleCollapse: () => {},
  onMobileClose: () => {},
};

describe("isPathActive", () => {
  it("matches exactly when `end`", () => {
    expect(isPathActive("/dashboard", "/dashboard", true)).toBe(true);
    expect(isPathActive("/dashboard", "/dashboard/x", true)).toBe(false);
  });

  it("prefix-matches on segment boundary by default", () => {
    expect(isPathActive("/products", "/products", false)).toBe(true);
    expect(isPathActive("/products", "/products/123", false)).toBe(true);
    expect(isPathActive("/products", "/products-list", false)).toBe(false);
  });

  it("never matches an undefined path", () => {
    expect(isPathActive(undefined, "/products")).toBe(false);
  });
});

describe("Sidebar", () => {
  it("renders groups and items", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("marks the active item with aria-current", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("Products").closest("a")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("calls onNavigate (not the browser) on item click", () => {
    const onNavigate = vi.fn();
    render(<Sidebar {...baseProps} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Products"));
    expect(onNavigate).toHaveBeenCalledWith("/products");
  });

  it("renders the version line with the app name", () => {
    render(<Sidebar {...baseProps} appName="BluePOS" version="1.2.3" />);
    expect(screen.getByText("v1.2.3", { exact: false })).toBeInTheDocument();
  });
});

describe("CompanySwitcher", () => {
  const companies = [
    { id: 1, primaryLabel: "Acme", secondaryLabel: "Acme SRL" },
    { id: 2, primaryLabel: "Globex", secondaryLabel: "Globex SA" },
  ];

  it("shows the active company and switches on select", () => {
    const onSelectCompany = vi.fn();
    render(
      <CompanySwitcher
        activeCompany={companies[0]}
        companies={companies}
        onSelectCompany={onSelectCompany}
      />,
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Acme")); // open popover
    fireEvent.click(screen.getByText("Globex"));
    expect(onSelectCompany).toHaveBeenCalledWith(2);
  });

  it("does not open when there is only one company", () => {
    render(
      <CompanySwitcher
        activeCompany={companies[0]}
        companies={[companies[0]]}
        onSelectCompany={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Acme"));
    expect(screen.queryByText("Your companies")).not.toBeInTheDocument();
  });
});
