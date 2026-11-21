import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Feedback/ErrorState",
  component: ErrorState,
  args: {
    message: "We couldn't load the companies. Check your connection and try again.",
    onRetry: () => {},
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};
export const Retrying: Story = { args: { isRetrying: true } };
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <ErrorState {...args} />
    </div>
  ),
};
