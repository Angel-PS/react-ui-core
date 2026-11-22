import type { Meta, StoryObj } from "@storybook/react";
import { Trend } from "./Trend";

const meta: Meta<typeof Trend> = {
  title: "Data/Trend",
  component: Trend,
  parameters: { layout: "centered" },
  args: { value: 12.4 },
};
export default meta;
type Story = StoryObj<typeof Trend>;

const All = () => (
  <div className="flex flex-col items-start gap-3">
    <Trend value={12.4} />
    <Trend value={-3.1} />
    <Trend value={0.8} showVs={false} />
    <Trend value={null} />
  </div>
);

export const Default: Story = {};

export const States: Story = { render: () => <All /> };

export const Dark: Story = {
  render: () => (
    <div className="dark">
      <div className="rounded-xl bg-slate-900 p-6">
        <All />
      </div>
    </div>
  ),
};
