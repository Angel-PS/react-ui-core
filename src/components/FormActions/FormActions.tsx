import { Button } from "../Button";
import { cn } from "../../lib/utils";

export interface FormActionsLabels {
  cancel: string;
  create: string;
  update: string;
}

export const DEFAULT_FORM_ACTIONS_LABELS: FormActionsLabels = {
  cancel: "Cancel",
  create: "Create",
  update: "Update",
};

export interface FormActionsProps {
  /** Called by the Cancel button (a plain `type="button"`, never submits). */
  onCancel?: () => void;
  /** Edit mode — the submit button reads `labels.update` instead of `labels.create`. */
  isEdit?: boolean;
  /** While true the submit button is disabled and shows a spinner. */
  isPending?: boolean;
  className?: string;
  /** Button text. Shallow-merged over the English defaults. */
  labels?: Partial<FormActionsLabels>;
}

/**
 * The standard Cancel + Create/Update footer of a form. The submit button is
 * `type="submit"`, so place this inside the `<form>` it belongs to.
 */
export const FormActions = ({
  onCancel,
  isEdit = false,
  isPending = false,
  className,
  labels,
}: FormActionsProps) => {
  const l = { ...DEFAULT_FORM_ACTIONS_LABELS, ...labels };
  return (
    <div className={cn("flex justify-end gap-4", className)}>
      <Button type="button" variant="cancel" onClick={onCancel}>
        {l.cancel}
      </Button>
      <Button type="submit" variant="primary" disabled={isPending} loading={isPending}>
        {isEdit ? l.update : l.create}
      </Button>
    </div>
  );
};

export default FormActions;
