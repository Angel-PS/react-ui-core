import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { faFileLines, faShieldHalved, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabPanel, type TabItem } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS: TabItem[] = [
  { id: "general", label: "General", icon: faFileLines },
  { id: "members", label: "Members", icon: faUsers, count: 12 },
  { id: "permissions", label: "Permissions", icon: faShieldHalved, errorCount: 2 },
  { id: "audit", label: "Audit log", disabled: true },
];

const Demo = () => {
  const [value, setValue] = useState("general");
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Tabs items={ITEMS} value={value} onChange={setValue} ariaLabel="Role editor" idPrefix="story" />
      {ITEMS.map((item) => (
        <TabPanel key={item.id} idPrefix="story" id={item.id} value={value}>
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-slate-800 dark:text-slate-400">
            {item.label} panel — stays mounted while hidden.
          </div>
        </TabPanel>
      ))}
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
