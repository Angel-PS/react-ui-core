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
  onRetry: () => void;
  /** While true the retry button is disabled and shows a spinner. */
  isRetrying?: boolean;
  className?: string;
  labels?: Partial<ErrorStateLabels>;
}

/**
 * Card for a failed load with a retry action. `role="alert"` so the failure
 * is announced when it replaces the content.
 */
export const ErrorState = ({
  message,
  onRetry,
  isRetrying = false,
  className,
  labels,
}: ErrorStateProps) => {
  const l = { ...DEFAULT_ERROR_STATE_LABELS, ...labels };
  return (
    <div
      role="alert"
      className={cn(
        "border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border p-8 text-center shadow-sm",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <FontAwesomeIcon icon={faTriangleExclamation} aria-hidden="true" />
      </span>
      <p className="text-muted-foreground max-w-sm text-sm">{message}</p>
      <Button variant="secondary" type="button" loading={isRetrying} onClick={onRetry}>
        {!isRetrying && <FontAwesomeIcon icon={faRotateRight} aria-hidden="true" />}
        {l.retry}
      </Button>
    </div>
  );
};

export default ErrorState;
