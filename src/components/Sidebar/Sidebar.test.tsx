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

  it("renders skeleton rows instead of the menu while loading", () => {
    render(<Sidebar {...baseProps} loading skeletonCount={5} />);
    expect(screen.getAllByTestId("sidebar-skeleton-row")).toHaveLength(5);
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-busy", "true");
  });

  it("hides the brand name on the collapsed rail but keeps brandIcon", () => {
    render(
      <Sidebar
        {...baseProps}
        isCollapsed
        appName="BluePOS"
        brandIcon={<img alt="logo" src="/logo.svg" />}
      />,
    );
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText("BluePOS")).toHaveClass("lg:hidden");
  });

  it("keeps the brand name visible when expanded", () => {
    render(<Sidebar {...baseProps} appName="BluePOS" />);
    expect(screen.getByText("BluePOS")).not.toHaveClass("lg:hidden");
  });

  it("renders a custom logo instead of the default brand", () => {
    render(<Sidebar {...baseProps} appName="BluePOS" logo={<b>Custom</b>} />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.queryByText("BluePOS")).not.toBeInTheDocument();
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

  it("shows a skeleton instead of the row while loading", () => {
    render(
      <CompanySwitcher
        loading
        activeCompany={companies[0]}
        companies={companies}
        onSelectCompany={() => {}}
      />,
    );
    expect(screen.getByTestId("company-switcher-skeleton")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });

  it("asks to pick a company when none is active, and lets a single one be picked", () => {
    const onSelectCompany = vi.fn();
    render(
      <CompanySwitcher
        activeCompany={null}
        companies={[companies[0]]}
        onSelectCompany={onSelectCompany}
        labels={{ noCompanyHint: "Platform only" }}
      />,
    );
    expect(screen.getByText("Select company")).toBeInTheDocument();
    expect(screen.getByText("Platform only")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Select company"));
    fireEvent.click(screen.getByText("Acme"));
    expect(onSelectCompany).toHaveBeenCalledWith(1);
  });

  it("says there is no company when none is active and none can be picked", () => {
    render(
      <CompanySwitcher
        activeCompany={null}
        companies={[]}
        onSelectCompany={() => {}}
      />,
    );
    expect(screen.getByText("No company")).toBeInTheDocument();
    fireEvent.click(screen.getByText("No company"));
    expect(screen.queryByText("Your companies")).not.toBeInTheDocument();
  });
});
