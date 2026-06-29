import type { Meta, StoryObj } from "@storybook/react";
import { NotificationBell } from "./NotificationBell";

const meta: Meta<typeof NotificationBell> = {
  title: "App Shell/Navbar Widgets/NotificationBell",
  component: NotificationBell,
  parameters: { layout: "centered" },
  args: {
    unreadCount: 2,
    onItemClick: () => {},
    onMarkAllRead: () => {},
    onViewAll: () => {},
    items: [
      { id: 1, title: "Invoice paid", body: "INV-0001 was settled.", time: "2m ago", read: false },
      { id: 2, title: "New customer", body: "Acme Retail signed up.", time: "1h ago", read: false },
      { id: 3, title: "Backup complete", time: "Yesterday", read: true },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof NotificationBell>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [], unreadCount: 0 } };
