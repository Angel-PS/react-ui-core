import { render, screen, fireEvent } from "@testing-library/react";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { NotificationBell } from "./NotificationBell";
import { NotificationListItem } from "./NotificationListItem";
import { getNotificationToneStyle } from "./notificationTones";
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

  it("names the unread dot and weights unread titles heavier than read ones", () => {
    render(<NotificationBell {...baseProps} labels={{ unread: "Sin leer" }} />);
    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
    const dots = screen.getAllByRole("img", { name: "Sin leer" });
    expect(dots).toHaveLength(1);
    expect(dots[0]).toHaveAttribute("title", "Sin leer");
    expect(screen.getByText("Invoice paid")).toHaveClass("font-semibold");
    expect(screen.getByText("New customer")).toHaveClass("font-medium");
    expect(screen.getByText("New customer")).not.toHaveClass("font-semibold");
  });
});

describe("NotificationListItem tones", () => {
  it("uses the tone's icon box and dot colors", () => {
    render(
      <NotificationListItem
        notification={{ id: 1, title: "Disk almost full", tone: "critical" }}
        onClick={() => {}}
      />,
    );
    const row = screen.getByRole("button", { name: /disk almost full/i });
    const iconBox = row.firstElementChild as HTMLElement;
    expect(iconBox).toHaveClass("bg-red-50", "dark:bg-red-950/40");
    expect(screen.getByRole("img", { name: "Unread" })).toHaveClass("bg-red-500");
  });

  it("falls back to the brand-blue bell without a tone", () => {
    render(
      <NotificationListItem
        notification={{ id: 1, title: "Hello" }}
        onClick={() => {}}
      />,
    );
    const iconBox = screen.getByRole("button", { name: /hello/i })
      .firstElementChild as HTMLElement;
    expect(iconBox).toHaveClass("bg-primary-blue-lightest");
    expect(iconBox.querySelector("svg")).toHaveAttribute("data-icon", "bell");
  });

  it("lets an explicit icon override the tone icon", () => {
    render(
      <NotificationListItem
        notification={{ id: 1, title: "Shipped", tone: "success", icon: faTruck }}
        onClick={() => {}}
      />,
    );
    const svg = screen.getByRole("button", { name: /shipped/i }).querySelector("svg");
    expect(svg).toHaveAttribute("data-icon", "truck");
  });

  it("maps every tone to a style with a dark variant on the tinted box", () => {
    (["info", "success", "warning", "critical"] as const).forEach((tone) => {
      expect(getNotificationToneStyle(tone).iconBox).toMatch(/dark:bg-/);
    });
    expect(getNotificationToneStyle("release").dot).toBe("bg-primary-blue-default");
  });
});
