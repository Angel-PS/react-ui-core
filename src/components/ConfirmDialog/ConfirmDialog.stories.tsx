import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "../Button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

const Demo = (args: { variant?: "danger" | "warning" | "info" }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
      <ConfirmDialog
        isOpen={open}
        variant={args.variant}
        title="Eliminar registro"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        warningFooter="Esta acción es permanente"
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
};

export const Danger: Story = { render: () => <Demo variant="danger" /> };
export const Warning: Story = { render: () => <Demo variant="warning" /> };
export const Info: Story = { render: () => <Demo variant="info" /> };
