import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "App Shell/Navbar Widgets/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Interactive: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="rounded-lg bg-white p-6 dark:bg-slate-900">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
        </div>
      </div>
    );
  },
};
