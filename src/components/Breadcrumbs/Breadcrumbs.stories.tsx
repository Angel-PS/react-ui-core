import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "App Shell/Breadcrumbs",
  component: Breadcrumbs,
  parameters: { layout: "fullscreen" },
  args: { onNavigate: (p) => alert(p) },
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Catalog" },
      { label: "Products", to: "/products" },
      { label: "Edit product" },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Admin" },
      { label: "Companies", to: "/admin/companies" },
      { label: "Acme", to: "/admin/companies/1" },
      { label: "Branches", to: "/admin/companies/1/branches" },
      { label: "Edit branch" },
    ],
  },
};
