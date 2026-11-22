import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { cn } from "../../lib/utils";

export interface ErrorStateLabels {
  retry: string;
}

export const DEFAULT_ERROR_STATE_LABELS: ErrorStateLabels = {
  retry: "Try again",
};

export interface ErrorStateProps {
  /** What failed, in the user's terms. */
  message: string;
  /** Retry handler. Omit it when there is nothing to retry; the button is hidden. */
  onRetry?: () => void;
  /** While true the retry button is disabled and shows a spinner. */
  isRetrying?: boolean;
  /**
   * `card` (default) draws its own bordered surface; `plain` draws only the
   * content, for use inside a card that already provides the surface.
   */
  variant?: "card" | "plain";
  className?: string;
  labels?: Partial<ErrorStateLabels>;
}

/**
 * A failed load, optionally with a retry action. `role="alert"` so the failure
 * is announced when it replaces the content — and so it is never mistaken for
 * an empty result.
 */
export const ErrorState = ({
  message,
  onRetry,
  isRetrying = false,
  variant = "card",
  className,
  labels,
}: ErrorStateProps) => {
  const l = { ...DEFAULT_ERROR_STATE_LABELS, ...labels };
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        variant === "card"
          ? "border-border bg-card rounded-2xl border p-8 shadow-sm"
          : "py-8",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <FontAwesomeIcon icon={faTriangleExclamation} aria-hidden="true" />
      </span>
      <p className="text-muted-foreground max-w-sm text-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" type="button" loading={isRetrying} onClick={onRetry}>
          {!isRetrying && <FontAwesomeIcon icon={faRotateRight} aria-hidden="true" />}
          {l.retry}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
