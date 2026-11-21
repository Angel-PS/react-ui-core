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

  describe("errorBoundary", () => {
    const Boom = ({ explode }: { explode: boolean }) => {
      if (explode) throw new Error("page crash");
      return <p>Page ok</p>;
    };
    let errorSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => errorSpy.mockRestore());

    it("keeps the shell when the page crashes", () => {
      render(
        <AppLayout sidebar={() => <aside data-testid="sidebar" />} errorBoundary>
          <Boom explode />
        </AppLayout>,
      );
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    });

    it("forwards boundary props (labels, onError)", () => {
      const onError = vi.fn();
      render(
        <AppLayout
          sidebar={() => <aside />}
          errorBoundary={{ onError, labels: { title: "Algo salió mal" } }}
        >
          <Boom explode />
        </AppLayout>,
      );
      expect(onError).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("alert")).toHaveTextContent("Algo salió mal");
    });

    it("recovers when contentKey changes", () => {
      const { rerender } = render(
        <AppLayout sidebar={() => <aside />} errorBoundary contentKey="/broken">
          <Boom explode />
        </AppLayout>,
      );
      expect(screen.getByRole("alert")).toBeInTheDocument();
      rerender(
        <AppLayout sidebar={() => <aside />} errorBoundary contentKey="/home">
          <Boom explode={false} />
        </AppLayout>,
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page ok")).toBeInTheDocument();
    });

    it("lets errors propagate when errorBoundary is off", () => {
      expect(() =>
        render(
          <AppLayout sidebar={() => <aside />}>
            <Boom explode />
          </AppLayout>,
        ),
      ).toThrow("page crash");
    });
  });
});
