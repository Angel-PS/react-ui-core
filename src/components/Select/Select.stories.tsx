import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: "1", label: "Sucursal principal" },
  { value: "2", label: "Sucursal norte" },
  { value: "3", label: "Sucursal sur" },
];

export const Default: Story = {
  args: { label: "Sucursal", options, placeholder: "Selecciona…" },
};

export const Requerido: Story = {
  args: { label: "Sucursal", options, required: true, placeholder: "Selecciona…" },
};

export const ConError: Story = {
  name: "Con error",
  args: { label: "Sucursal", options, error: "Campo requerido" },
};

export const Cargando: Story = {
  name: "Estado de carga",
  args: { label: "Sucursal", options, loading: true },
};
