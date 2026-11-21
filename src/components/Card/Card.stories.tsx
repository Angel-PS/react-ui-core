import type { Meta, StoryObj } from "@storybook/react";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Card } from "./Card";
import { SettingRow } from "./SettingRow";
import { FormActions } from "../FormActions";

const Rows = () => (
  <div className="divide-y divide-gray-100 dark:divide-slate-800">
    <SettingRow title="Session length" description="How long a session lasts without activity." htmlFor="len">
      <select id="len" className="w-full">
        <option>30 minutes</option>
      </select>
    </SettingRow>
    <SettingRow title="Lock after failed attempts" description="Wrong passwords in a row before the account locks." htmlFor="lock">
      <input id="lock" className="input w-full" defaultValue={5} />
    </SettingRow>
  </div>
);

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  args: {
    title: "Sign-in security",
    description: "How this server protects accounts when people sign in.",
    icon: faShieldHalved,
    footer: <FormActions isEdit onCancel={() => {}} />,
    children: <Rows />,
  },
  decorators: [(Story) => <div style={{ maxWidth: 760 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
export const WithoutFooter: Story = { args: { footer: undefined, icon: undefined } };
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <Card {...args} />
    </div>
  ),
};
