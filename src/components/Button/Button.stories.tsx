import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "classic",
        "cancel",
        "active-filter",
        "inactive-filter",
        "toolbar-button",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Guardar", variant: "primary" } };
export const Secondary: Story = { args: { children: "Secundario", variant: "secondary" } };
export const Classic: Story = { args: { children: "Clásico", variant: "classic" } };
export const Cancel: Story = { args: { children: "Eliminar", variant: "cancel" } };
export const Loading: Story = { args: { children: "Guardando…", loading: true } };
export const Disabled: Story = { args: { children: "Deshabilitado", disabled: true } };

export const Todas: Story = {
  name: "Todas las variantes",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="classic">Classic</Button>
      <Button variant="cancel">Cancel</Button>
      <Button variant="active-filter">Active filter</Button>
      <Button variant="inactive-filter">Inactive filter</Button>
    </div>
  ),
};
