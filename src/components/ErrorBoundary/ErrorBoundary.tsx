import { Component, type ErrorInfo, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { cn } from "../../lib/utils";

export interface ErrorBoundaryLabels {
  title: string;
  description: string;
  reload: string;
}

export const DEFAULT_ERROR_BOUNDARY_LABELS: ErrorBoundaryLabels = {
  title: "Something went wrong",
  description: "This page hit an unexpected error. Your data is safe — reload to try again.",
  reload: "Reload",
};

export interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Custom fallback. Receives `reset`, which clears the error and renders
   * `children` again. Without it the default crash card is shown.
   */
  fallback?: (reset: () => void) => ReactNode;
  /** Report the error (logging, Sentry…). Defaults to `console.error`. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** The default card's button. Defaults to `window.location.reload()`. */
  onRetry?: () => void;
  /**
   * When this value changes the boundary clears its error — pass the current
   * route so navigating away from a crashed page recovers.
   */
  resetKey?: unknown;
  /** Extra classes for the default crash card's wrapper. */
  className?: string;
  labels?: Partial<ErrorBoundaryLabels>;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const CrashCard = ({
  labels,
  onRetry,
  className,
}: {
  labels: ErrorBoundaryLabels;
  onRetry: () => void;
  className?: string;
}) => (
  <div className={cn("grid min-h-[60vh] place-items-center px-4", className)}>
    <div
      role="alert"
      className="border-border bg-card w-full max-w-md rounded-2xl border p-8 text-center shadow-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          aria-hidden="true"
          className="text-xl text-red-600 dark:text-red-400"
        />
      </div>
      <h2 className="text-foreground mt-5 text-xl font-semibold">{labels.title}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed">
        {labels.description}
      </p>
      <div className="mt-6">
        <Button type="button" onClick={onRetry}>
          {labels.reload}
        </Button>
      </div>
    </div>
  </div>
);

/**
 * Catches render errors below it so one broken page doesn't blank the whole
 * app. Wrap page content (see `AppLayout`'s `errorBoundary`), not the shell.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (this.props.onError) this.props.onError(error, info);
    else console.error("Render error", error, info.componentStack);
  }

  componentDidUpdate(prev: ErrorBoundaryProps): void {
    if (this.state.hasError && !Object.is(prev.resetKey, this.props.resetKey)) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.reset);
    return (
      <CrashCard
        labels={{ ...DEFAULT_ERROR_BOUNDARY_LABELS, ...this.props.labels }}
        onRetry={this.props.onRetry ?? (() => window.location.reload())}
        className={this.props.className}
      />
    );
  }
}

export default ErrorBoundary;
