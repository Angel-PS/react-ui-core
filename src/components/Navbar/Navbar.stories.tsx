import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { SearchTrigger } from "../SearchTrigger";
import { ThemeToggle } from "../ThemeToggle";
import { NotificationBell } from "../NotificationBell";
import { UserMenu } from "../UserMenu";

const meta: Meta<typeof Navbar> = {
  title: "App Shell/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

export const Composed: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-48 bg-slate-50 dark:bg-slate-950">
          <Navbar
            title="Dashboard"
            onMenuClick={() => {}}
            actions={
              <>
                <SearchTrigger onOpen={() => {}} />
                <NotificationBell
                  items={[]}
                  unreadCount={0}
                  onItemClick={() => {}}
                  onMarkAllRead={() => {}}
                  onViewAll={() => {}}
                />
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
                <UserMenu
                  fullName="Ada Lovelace"
                  username="ada"
                  items={[{ key: "logout", label: "Logout", variant: "danger", onClick: () => {} }]}
                />
              </>
            }
          />
        </div>
      </div>
    );
  },
};
