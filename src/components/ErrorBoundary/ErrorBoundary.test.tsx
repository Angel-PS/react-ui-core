import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const Boom = ({ explode }: { explode: boolean }) => {
  if (explode) throw new Error("kaboom");
  return <p>All good</p>;
};

describe("ErrorBoundary", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    // React logs caught render errors; keep the test output clean.
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => errorSpy.mockRestore());

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("shows the default crash card with English labels", () => {
    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong");
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
  });

  it("uses translated labels and onRetry", () => {
    const onRetry = vi.fn();
    render(
      <ErrorBoundary onRetry={onRetry} labels={{ title: "Algo salió mal", reload: "Recargar" }}>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Algo salió mal");
    fireEvent.click(screen.getByRole("button", { name: "Recargar" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("calls onError with the thrown error", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect((onError.mock.calls[0][0] as Error).message).toBe("kaboom");
  });

  it("logs with console.error when no onError is given", () => {
    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(errorSpy.mock.calls.some((c: unknown[]) => c[0] === "Render error")).toBe(true);
  });

  it("recovers through the fallback's reset", () => {
    const Harness = () => {
      const [explode, setExplode] = useState(true);
      return (
        <ErrorBoundary
          fallback={(reset) => (
            <button
              type="button"
              onClick={() => {
                setExplode(false);
                reset();
              }}
            >
              Retry
            </button>
          )}
        >
          <Boom explode={explode} />
        </ErrorBoundary>
      );
    };
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("clears the error when resetKey changes", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey="/crashed">
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(
      <ErrorBoundary resetKey="/healthy">
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("All good")).toBeInTheDocument();
  });
});
