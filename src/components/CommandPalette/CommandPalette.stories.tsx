import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  faGaugeHigh,
  faFileInvoice,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { CommandPalette } from "./CommandPalette";
import { Button } from "../Button";

const meta: Meta<typeof CommandPalette> = {
  title: "App Shell/Navbar Widgets/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

const sections = [
  {
    id: "nav",
    title: "Navigate",
    items: [
      { id: "dash", label: "Dashboard", icon: faGaugeHigh, path: "/dashboard", groupLabel: "Operations" },
      { id: "inv", label: "Invoices", icon: faFileInvoice, path: "/invoices", groupLabel: "Operations" },
      { id: "cust", label: "Customers", icon: faUsers, path: "/customers", groupLabel: "Catalog" },
    ],
  },
  {
    id: "create",
    title: "Create",
    items: [{ id: "new-inv", label: "New invoice", icon: faPlus, path: "/invoices/add" }],
  },
];

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open palette</Button>
        {open && (
          <CommandPalette
            sections={sections}
            onSelect={(i) => alert(i.path)}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};
