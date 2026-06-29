import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  faGaugeHigh,
  faFileInvoice,
  faUsers,
  faBox,
  faGear,
  faCreditCard,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { AppLayout } from "./AppLayout";
import { Sidebar, CompanySwitcher } from "../Sidebar";
import { Navbar } from "../Navbar";
import { Breadcrumbs } from "../Breadcrumbs";
import { AlertBanner } from "../AlertBanner";
import { SearchTrigger } from "../SearchTrigger";
import { NotificationBell } from "../NotificationBell";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { NewActionMenu } from "../NewActionMenu";
import { UserMenu } from "../UserMenu";
import { CommandPalette } from "../CommandPalette";

const groups = [
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

const companies = [
  { id: 1, primaryLabel: "Acme Retail", secondaryLabel: "101-00000-1" },
  { id: 2, primaryLabel: "Globex Corp", secondaryLabel: "102-00000-2" },
];

const meta: Meta<typeof AppLayout> = {
  title: "App Shell/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

const Demo = ({ dark = false }: { dark?: boolean }) => {
  const [isDark, setIsDark] = useState(dark);
  const [activePath, setActivePath] = useState("/dashboard");
  const [activeCompany, setActiveCompany] = useState<string | number>(1);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <AppLayout
        sidebar={(s) => (
          <Sidebar
            {...s}
            groups={groups}
            activePath={activePath}
            onNavigate={setActivePath}
            appName="BluePOS"
            version="0.4.0"
            footer={
              <CompanySwitcher
                activeCompany={companies.find((c) => c.id === activeCompany)}
                companies={companies}
                onSelectCompany={setActiveCompany}
                isCollapsed={s.isCollapsed}
              />
            }
          />
        )}
        navbar={(s) => (
          <Navbar
            title="Dashboard"
            onMenuClick={s.onMenuClick}
            actions={
              <>
                <SearchTrigger onOpen={() => setPaletteOpen(true)} />
                <NotificationBell
                  unreadCount={2}
                  onItemClick={() => {}}
                  onMarkAllRead={() => {}}
                  onViewAll={() => {}}
                  items={[
                    { id: 1, title: "Invoice paid", body: "INV-0001", time: "2m", read: false },
                    { id: 2, title: "New customer", time: "1h", read: false },
                  ]}
                />
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
                <LanguageSwitcher
                  current="en"
                  onChange={() => {}}
                  languages={[
                    { code: "es", label: "Español" },
                    { code: "en", label: "English" },
                  ]}
                />
                <NewActionMenu
                  onSelect={setActivePath}
                  groups={[
                    {
                      title: "Sales",
                      items: [
                        { id: "invoice", label: "Invoice", hint: "New invoice", icon: faFileInvoiceDollar, path: "/invoices/add", primary: true },
                      ],
                    },
                    {
                      title: "Catalog",
                      items: [
                        { id: "product", label: "Product", hint: "New product", icon: faBox, path: "/products/add" },
                      ],
                    },
                  ]}
                />
                <UserMenu
                  fullName="Ada Lovelace"
                  username="ada"
                  items={[
                    { key: "settings", label: "Settings", onClick: () => setActivePath("/settings") },
                    { key: "logout", label: "Logout", variant: "danger", onClick: () => {} },
                  ]}
                />
              </>
            }
          >
            {paletteOpen && (
              <CommandPalette
                onClose={() => setPaletteOpen(false)}
                onSelect={(i) => setActivePath(i.path)}
                sections={[
                  {
                    id: "nav",
                    title: "Navigate",
                    items: [
                      { id: "dash", label: "Dashboard", icon: faGaugeHigh, path: "/dashboard" },
                      { id: "inv", label: "Invoices", icon: faFileInvoice, path: "/invoices" },
                    ],
                  },
                ]}
              />
            )}
          </Navbar>
        )}
        breadcrumbs={
          <Breadcrumbs
            onNavigate={setActivePath}
            items={[
              { label: "Home", to: "/" },
              { label: "Operations" },
              { label: "Dashboard" },
            ]}
          />
        }
        banner={
          <AlertBanner
            tone="info"
            message="Your trial expires in 5 days."
            action={{ label: "View plan", onClick: () => setActivePath("/subscription") }}
            dismissible
          />
        }
      >
        <div className="text-sm text-gray-600 dark:text-slate-300">
          Active route: <code>{activePath}</code>
        </div>
      </AppLayout>
    </div>
  );
};

export const Light: Story = { render: () => <Demo /> };
export const Dark: Story = { render: () => <Demo dark /> };
