import type { Meta, StoryObj } from "@storybook/react";
import { faBell, faInbox } from "@fortawesome/free-solid-svg-icons";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    icon: faInbox,
    title: "No applications yet",
    description: "Register an application to let it sign users in through this server.",
    action: <Button>New application</Button>,
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Medium: Story = {};
export const Small: Story = {
  args: {
    size: "sm",
    icon: faBell,
    title: "You're all caught up",
    description: "New notifications will show up here.",
    action: undefined,
  },
};
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <EmptyState {...args} />
    </div>
  ),
};
