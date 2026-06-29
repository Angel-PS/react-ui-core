import type { Meta, StoryObj } from "@storybook/react";
import { SearchTrigger } from "./SearchTrigger";

const meta: Meta<typeof SearchTrigger> = {
  title: "App Shell/Navbar Widgets/SearchTrigger",
  component: SearchTrigger,
  parameters: { layout: "centered" },
  args: { onOpen: () => alert("open palette") },
};
export default meta;
type Story = StoryObj<typeof SearchTrigger>;

export const Default: Story = {};
export const Spanish: Story = {
  args: { labels: { trigger: "Buscar…", triggerAria: "Abrir búsqueda", shortcut: "⌘K" } },
};
