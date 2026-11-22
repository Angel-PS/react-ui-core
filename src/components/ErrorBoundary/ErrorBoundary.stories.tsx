import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "./ErrorBoundary";

const Crash = (): never => {
  throw new Error("Story crash");
};

const meta: Meta<typeof ErrorBoundary> = {
  title: "Feedback/ErrorBoundary",
  component: ErrorBoundary,
  args: { onRetry: () => {}, onError: () => {}, children: <Crash /> },
};
export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const DefaultFallback: Story = {};
export const CustomFallback: Story = {
  args: {
    fallback: (reset) => (
      <button type="button" className="primary-button" onClick={reset}>
        Custom fallback — reset
      </button>
    ),
  },
};
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <ErrorBoundary {...args} />
    </div>
  ),
};
