import type { Meta, StoryObj } from "@storybook/react";
import {
  faBox,
  faFileInvoiceDollar,
  faFileLines,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { NewActionMenu } from "./NewActionMenu";

const meta: Meta<typeof NewActionMenu> = {
  title: "App Shell/Navbar Widgets/NewActionMenu",
  component: NewActionMenu,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof NewActionMenu>;

export const Default: Story = {
  args: {
    onSelect: (p) => alert(p),
    groups: [
      {
        title: "Sales documents",
        items: [
          { id: "invoice", label: "Invoice", hint: "Create a fiscal invoice", icon: faFileInvoiceDollar, path: "/invoices/add", primary: true },
          { id: "quotation", label: "Quotation", hint: "Draft a quote", icon: faFileLines, path: "/quotations/add" },
        ],
      },
      {
        title: "Catalog",
        items: [
          { id: "customer", label: "Customer", hint: "Add a customer", icon: faUserPlus, path: "/customers?quick-action=add" },
          { id: "product", label: "Product", hint: "Add a product", icon: faBox, path: "/products?quick-action=add" },
        ],
      },
    ],
  },
};
