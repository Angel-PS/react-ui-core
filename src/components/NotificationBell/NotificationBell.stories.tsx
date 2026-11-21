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

export const Tones: Story = {
  args: {
    unreadCount: 4,
    items: [
      { id: 1, title: "New version available", body: "v2.4 is ready to install.", time: "Just now", tone: "release" },
      { id: 2, title: "Payment received", body: "INV-0001 was settled.", time: "2m ago", tone: "success" },
      { id: 3, title: "Certificate expires soon", body: "Renew it within 7 days.", time: "1h ago", tone: "warning" },
      { id: 4, title: "Sync failed", body: "3 documents could not be sent.", time: "3h ago", tone: "critical" },
      { id: 5, title: "Scheduled maintenance", body: "Sunday 2:00-3:00 AM.", time: "Yesterday", tone: "info", read: true },
    ],
  },
};
