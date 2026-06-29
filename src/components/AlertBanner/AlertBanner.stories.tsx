import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./AlertBanner";

const meta: Meta<typeof AlertBanner> = {
  title: "App Shell/AlertBanner",
  component: AlertBanner,
  parameters: { layout: "fullscreen" },
  args: { action: { label: "View plan", onClick: () => {} }, dismissible: true },
};
export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Info: Story = { args: { tone: "info", message: "Your trial expires in 5 days." } };
export const Warning: Story = { args: { tone: "warning", message: "Your subscription expires soon." } };
export const Error: Story = {
  args: { tone: "error", message: "Your subscription is inactive. Renew to continue.", dismissible: false },
};
