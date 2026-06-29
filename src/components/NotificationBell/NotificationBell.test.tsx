import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationBell } from "./NotificationBell";
import type { NotificationItem } from "./NotificationBell.types";

const items: NotificationItem[] = [
  { id: 1, title: "Invoice paid", body: "INV-001 was paid", read: false },
  { id: 2, title: "New customer", read: true },
];

const baseProps = {
  items,
  unreadCount: 1,
  onItemClick: () => {},
  onMarkAllRead: () => {},
  onViewAll: () => {},
};

describe("NotificationBell", () => {
  it("shows the unread badge", () => {
    render(<NotificationBell {...baseProps} unreadCount={12} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("opens the panel and fires item + mark-all callbacks", () => {
    const onItemClick = vi.fn();
    const onMarkAllRead = vi.fn();
    render(
      <NotificationBell
        {...baseProps}
        onItemClick={onItemClick}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    fireEvent.click(screen.getByText("Invoice paid"));
    expect(onItemClick).toHaveBeenCalledWith(items[0]);
    fireEvent.click(screen.getByText("Mark all as read"));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state when there are no items", () => {
    render(<NotificationBell {...baseProps} items={[]} unreadCount={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("You're all caught up")).toBeInTheDocument();
  });
});
