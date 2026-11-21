import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Switch>;

const Demo = () => {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex items-center justify-between">
        <label htmlFor="sw-on" className="mb-0">
          Email alerts
        </label>
        <Switch id="sw-on" checked={on} onChange={setOn} />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="sw-off" className="mb-0">
          Daily summary
        </label>
        <Switch id="sw-off" checked={off} onChange={setOff} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-slate-400">Disabled</span>
        <div className="flex gap-2">
          <Switch checked disabled onChange={() => {}} aria-label="Disabled on" />
          <Switch checked={false} disabled onChange={() => {}} aria-label="Disabled off" />
        </div>
      </div>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };

export const Dark: Story = {
  render: () => (
    <div className="dark">
      <div className="rounded-xl bg-slate-900 p-6">
        <Demo />
      </div>
    </div>
  ),
};
