import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ColorInput, isHexColor } from "./ColorInput";
import type { ColorInputProps } from "./ColorInput";

const meta: Meta<typeof ColorInput> = {
  title: "Components/ColorInput",
  component: ColorInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorInput>;

const Controlled = (args: Partial<ColorInputProps>) => {
  const [value, setValue] = useState(args.value ?? "#4061A8");
  const error = value && !isHexColor(value) ? "Enter a hex color like #4061A8" : null;
  return (
    <div className="max-w-sm pb-64">
      <ColorInput {...args} value={value} onChange={setValue} error={args.error ?? error} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "brand", label: "Brand color" },
};

export const Invalid: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "brand-invalid", label: "Brand color", value: "#12G" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "brand-disabled", label: "Brand color", disabled: true },
};

export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <Controlled {...args} name="brand-dark" label="Brand color" />
    </div>
  ),
};
