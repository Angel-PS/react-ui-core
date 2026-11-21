import type { Meta, StoryObj } from "@storybook/react";
import { faBuilding, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Layout/SectionHeading",
  component: SectionHeading,
  args: { icon: faBuilding, title: "General details" },
};
export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {};
export const Security: Story = { args: { icon: faShieldHalved, title: "Security" } };
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6" style={{ maxWidth: 480 }}>
      <SectionHeading {...args} />
    </div>
  ),
};
