import { render, screen, fireEvent } from "@testing-library/react";
import { AppLayout } from "./AppLayout";

describe("AppLayout", () => {
  it("renders sidebar, navbar, breadcrumbs, banner and children", () => {
    render(
      <AppLayout
        sidebar={() => <aside data-testid="sidebar" />}
        navbar={() => <nav data-testid="navbar" />}
        breadcrumbs={<div data-testid="crumbs" />}
        banner={<div data-testid="banner" />}
      >
        <p>Page content</p>
      </AppLayout>,
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("crumbs")).toBeInTheDocument();
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("opens the mobile drawer via the navbar's onMenuClick", () => {
    let mobileOpen = false;
    render(
      <AppLayout
        sidebar={(s) => {
          mobileOpen = s.isMobileOpen;
          return <aside />;
        }}
        navbar={(s) => (
          <button onClick={s.onMenuClick}>menu</button>
        )}
      >
        content
      </AppLayout>,
    );
    expect(mobileOpen).toBe(false);
    fireEvent.click(screen.getByText("menu"));
    expect(mobileOpen).toBe(true);
  });

  it("hides the header when showHeader is false", () => {
    render(
      <AppLayout
        sidebar={() => <aside />}
        navbar={() => <nav data-testid="navbar" />}
        showHeader={false}
      >
        content
      </AppLayout>,
    );
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });
});
