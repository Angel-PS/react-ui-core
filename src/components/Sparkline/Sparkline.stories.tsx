import type { Meta, StoryObj } from "@storybook/react";
import { Sparkline } from "./Sparkline";

const meta: Meta<typeof Sparkline> = {
  title: "Data/Sparkline",
  component: Sparkline,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Sparkline>;

const UP = [12, 14, 13, 17, 16, 19, 22, 21, 25, 28];
const FLAT = [30, 31, 29, 33, 30, 32, 31, 34, 32, 33];
const DOWN = [28, 26, 27, 22, 23, 19, 18, 16, 17, 13];

const Cards = () => (
  <div className="grid grid-cols-3 gap-4">
    {[
      { label: "Active users", value: "1,284", data: UP, color: undefined, fill: true },
      { label: "Sign-ins", value: "9,410", data: FLAT, color: undefined, fill: false },
      { label: "Failed logins", value: "37", data: DOWN, color: "#ef4444", fill: true },
    ].map((c) => (
      <div
        key={c.label}
        className="flex items-end justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">{c.label}</p>
          <p className="text-xl font-bold text-gray-900 tabular-nums dark:text-slate-100">{c.value}</p>
        </div>
        <Sparkline data={c.data} color={c.color} fill={c.fill} width={140} height={40} />
      </div>
    ))}
  </div>
);

export const Default: Story = { args: { data: UP } };

export const InKpiCards: Story = { render: () => <Cards /> };

export const Dark: Story = {
  render: () => (
    <div className="dark">
      <div className="rounded-xl bg-slate-950 p-6">
        <Cards />
      </div>
    </div>
  ),
};
