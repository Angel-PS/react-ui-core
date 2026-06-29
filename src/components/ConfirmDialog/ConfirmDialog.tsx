import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleExclamation,
  faCircleInfo,
  faLock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../Modal";
import { Button } from "../Button";

export interface ConfirmDialogItemDetail {
  label: string;
  value: string;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<unknown>;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  itemDetails?: ConfirmDialogItemDetail[];
  warningFooter?: string;
  /** Accessible label for the close (X) button. Default: "Close". */
  closeLabel?: string;
}

const VARIANT_STYLES = {
  danger: {
    iconBg: "bg-red-50 dark:bg-red-950/40 ring-red-100 dark:ring-red-900/50",
    iconColor: "text-red-500",
    icon: faTriangleExclamation,
  },
  warning: {
    iconBg:
      "bg-amber-50 dark:bg-amber-950/40 ring-amber-100 dark:ring-amber-900/50",
    iconColor: "text-amber-500",
    icon: faCircleExclamation,
  },
  info: {
    iconBg: "bg-primary-blue-lightest ring-primary-blue-lighter",
    iconColor: "text-primary-blue-default",
    icon: faCircleInfo,
  },
} as const;

export const ConfirmDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  isLoading = false,
  itemDetails,
  warningFooter,
  closeLabel = "Close",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const styles = VARIANT_STYLES[variant];
  const confirmVariant = variant === "danger" ? "cancel" : "primary";
  const iconClassName = `flex h-12 w-12 items-center justify-center rounded-full ring-8 ${styles.iconBg}`;

  return (
    <Modal
      onHide={onCancel}
      hideOnClickOutside={!isLoading}
      canClose={!isLoading}
      headerContent={null}
    >
      {!isLoading && (
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-gray-400 dark:text-slate-500 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 focus:outline-none"
          aria-label={closeLabel}
        >
          <FontAwesomeIcon icon={faXmark} className="text-sm" />
        </button>
      )}
      <div className="flex flex-col items-center gap-4 pt-2">
        <div className={iconClassName}>
          <FontAwesomeIcon
            icon={styles.icon}
            className={`text-lg ${styles.iconColor}`}
          />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {title}
          </h2>
          <p className="text-description-helper mt-1.5 text-sm">
            {description}
          </p>
        </div>

        {itemDetails && itemDetails.length > 0 && (
          <div className="mt-4 w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 px-4 py-3">
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-slate-800">
              {itemDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-description-helper text-[11px] font-semibold tracking-wider uppercase">
                    {detail.label}
                  </span>
                  <span className="text-right text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {detail.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 grid w-full gap-3 md:grid-cols-2">
          <Button
            variant="classic"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            type="button"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>

        {warningFooter && (
          <div className="text-description-helper flex items-center gap-1.5 text-xs">
            <FontAwesomeIcon icon={faLock} className="text-[10px]" />
            <span>{warningFooter}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
