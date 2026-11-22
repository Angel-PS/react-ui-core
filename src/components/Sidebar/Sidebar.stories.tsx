import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  faGaugeHigh,
  faFileInvoice,
  faUsers,
  faBox,
  faGear,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "./Sidebar";
import { CompanySwitcher } from "./CompanySwitcher";
import type { SidebarGroup, CompanyOption } from "./Sidebar.types";

const groups: SidebarGroup[] = [
  {
    key: "operations",
    title: "Operations",
    items: [
      { key: "dashboard", label: "Dashboard", icon: faGaugeHigh, path: "/dashboard", end: true },
      { key: "invoices", label: "Invoices", icon: faFileInvoice, path: "/invoices" },
    ],
  },
  {
    key: "catalog",
    title: "Catalog",
    items: [
      { key: "customers", label: "Customers", icon: faUsers, path: "/customers" },
      { key: "products", label: "Products", icon: faBox, path: "/products" },
    ],
  },
  {
    key: "system",
    title: "System",
    items: [
      { key: "subscription", label: "My plan", icon: faCreditCard, path: "/subscription" },
      { key: "settings", label: "Settings", icon: faGear, path: "/settings" },
    ],
  },
];

const companies: CompanyOption[] = [
  { id: 1, primaryLabel: "Acme Retail", secondaryLabel: "101-00000-1" },
  { id: 2, primaryLabel: "Globex Corp", secondaryLabel: "102-00000-2" },
];

const meta: Meta<typeof Sidebar> = {
  title: "App Shell/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

const Demo = ({
  dark = false,
  loading = false,
}: {
  dark?: boolean;
  loading?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");
  const [activeId, setActiveId] = useState<string | number>(1);
  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar
          groups={groups}
          activePath={activePath}
          onNavigate={setActivePath}
          isCollapsed={isCollapsed}
          isMobileOpen={false}
          onToggleCollapse={() => setIsCollapsed((c) => !c)}
          onMobileClose={() => {}}
          appName="BluePOS"
          brandIcon={
            <span className="bg-primary-blue-default grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white shadow-xs">
              BP
            </span>
          }
          version="0.4.0"
          loading={loading}
          footer={
            <CompanySwitcher
              activeCompany={companies.find((c) => c.id === activeId)}
              companies={companies}
              onSelectCompany={setActiveId}
              isCollapsed={isCollapsed}
              loading={loading}
            />
          }
        />
        <main className="flex-1 p-8 text-sm text-gray-600 dark:text-slate-300">
          Active: {activePath}
        </main>
      </div>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };
export const Dark: Story = { render: () => <Demo dark /> };
export const Loading: Story = { render: () => <Demo loading /> };
export const LoadingDark: Story = { render: () => <Demo dark loading /> };

export const NoActiveCompany: Story = {
  render: () => (
    <div className="w-60 p-2">
      <CompanySwitcher
        activeCompany={null}
        companies={companies}
        onSelectCompany={() => {}}
        labels={{ noCompanyHint: "Platform only" }}
      />
    </div>
  ),
};
