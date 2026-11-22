import type { Meta, StoryObj } from "@storybook/react";
import { UserMenu } from "./UserMenu";

const meta: Meta<typeof UserMenu> = {
  title: "App Shell/Navbar Widgets/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {
  args: {
    fullName: "Ada Lovelace",
    username: "ada",
    items: [
      { key: "settings", label: "Settings", onClick: () => alert("settings") },
      { key: "logout", label: "Logout", variant: "danger", onClick: () => alert("logout") },
    ],
  },
};

export const Loading: Story = {
  args: { ...Default.args, loading: true },
};

/** Avatar only below 1280px — for a crowded navbar at tablet widths. */
export const NameFromXl: Story = {
  args: { ...Default.args, nameBreakpoint: "xl" },
};
