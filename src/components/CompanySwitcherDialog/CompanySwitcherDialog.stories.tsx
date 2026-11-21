import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { CompanySwitcherDialog } from "./CompanySwitcherDialog";
import type { CompanySwitcherDialogProps } from "./CompanySwitcherDialog";
import type { CompanyOption } from "../Sidebar/Sidebar.types";

const meta: Meta<typeof CompanySwitcherDialog> = {
  title: "App Shell/CompanySwitcherDialog",
  component: CompanySwitcherDialog,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CompanySwitcherDialog>;

const companies: CompanyOption[] = [
  { id: "1", primaryLabel: "Acme Foods", secondaryLabel: "RNC 1-01-00000-1" },
  { id: "2", primaryLabel: "Northwind Traders", secondaryLabel: "RNC 1-02-00000-2" },
  { id: "3", primaryLabel: "Contoso Retail", secondaryLabel: "Contoso Retail Group, S.R.L." },
  { id: "4", primaryLabel: "Fabrikam Imports", secondaryLabel: "RNC 1-03-00000-3" },
  { id: "5", primaryLabel: "Globex Logistics", secondaryLabel: "RNC 1-04-00000-4" },
  { id: "6", primaryLabel: "Compañía Norte", secondaryLabel: "RNC 1-05-00000-5" },
];

const Demo = (args: Partial<CompanySwitcherDialogProps>) => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<CompanyOption["id"] | null>("1");
  return (
    <div className="min-h-[640px] p-6">
      <button type="button" className="primary-button" onClick={() => setOpen(true)}>
        Switch company
      </button>
      <CompanySwitcherDialog
        companies={companies}
        recentCompanies={companies.slice(0, 2)}
        {...args}
        open={open}
        activeCompanyId={active}
        onClose={() => setOpen(false)}
        onSelect={(c) => {
          setActive(c.id);
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Demo {...args} />,
};

export const WithDeselect: Story = {
  render: (args) => <Demo {...args} onDeselect={() => {}} />,
};

export const Loading: Story = {
  render: (args) => <Demo {...args} isLoading isSearching />,
};

export const LoadingMore: Story = {
  render: (args) => <Demo {...args} hasMore isLoadingMore matchCount={24} />,
};

/** The dialog portals to document.body, so dark mode must be on <html>. */
const DarkHtml = (args: Partial<CompanySwitcherDialogProps>) => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);
  return (
    <div className="min-h-[640px] bg-slate-950">
      <Demo {...args} onDeselect={() => {}} />
    </div>
  );
};

export const Dark: Story = {
  render: (args) => <DarkHtml {...args} />,
};
