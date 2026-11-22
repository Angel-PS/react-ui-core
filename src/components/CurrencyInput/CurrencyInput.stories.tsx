import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import type { CurrencyInputProps } from "./CurrencyInput";

const meta: Meta<typeof CurrencyInput> = {
  title: "Components/CurrencyInput",
  component: CurrencyInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

const Controlled = (args: Partial<CurrencyInputProps>) => {
  const [value, setValue] = useState<number | null>(
    (args.value as number | null | undefined) ?? 1250,
  );
  return (
    <div className="max-w-sm">
      <CurrencyInput {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "amount",
    label: "Amount",
    required: true,
    hint: "Groups digits as you type, formats on blur.",
  },
};

export const WithError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "amount-error",
    label: "Amount",
    value: 0,
    error: "Amount must be at least 1.00",
  },
};

export const Clamped: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "amount-clamped",
    label: "Discount (0–100)",
    value: 10,
    minValue: 0,
    maxValue: 100,
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "amount-disabled", label: "Amount", value: 980, disabled: true },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "amount-loading", label: "Amount", loading: true },
};

export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <div className="flex max-w-sm flex-col gap-6">
        <Controlled {...args} name="dark-a" label="Amount" />
        <Controlled {...args} name="dark-b" label="Error" value={0} error="Amount must be at least 1.00" />
        <Controlled {...args} name="dark-c" label="Disabled" value={980} disabled />
      </div>
    </div>
  ),
};
