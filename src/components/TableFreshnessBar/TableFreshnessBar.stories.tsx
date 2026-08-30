import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TableFreshnessBar } from "./TableFreshnessBar";

const meta: Meta<typeof TableFreshnessBar> = {
  title: "Components/TableFreshnessBar",
  component: TableFreshnessBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableFreshnessBar>;

const MINUTE = 60_000;

/** Fetched moments ago: the stamp reads "just now" and the dot is green. */
export const Fresh: Story = {
  args: { updatedAt: Date.now() - 5_000, onRefresh: () => {} },
};

/** Past the 5-minute threshold the dot turns amber — the copy still carries
 *  the meaning, so the color only reinforces it. */
export const Stale: Story = {
  args: { updatedAt: Date.now() - 12 * MINUTE, onRefresh: () => {} },
};

/** Nothing has loaded yet: the control stays enabled so the user can try. */
export const NeverLoaded: Story = {
  args: { onRefresh: () => {} },
};

/** Icon spins, button disabled, and the live region announces the round trip. */
export const Refreshing: Story = {
  args: {
    updatedAt: Date.now() - MINUTE,
    isRefreshing: true,
    onRefresh: () => {},
  },
};

/** Every string goes through `labels`; the relative label follows `locale`. */
export const Localized: Story = {
  args: {
    updatedAt: Date.now() - 3 * MINUTE,
    locale: "es",
    timeZone: "America/Santo_Domingo",
    onRefresh: () => {},
    labels: {
      refresh: "Actualizar",
      ariaLabel: "Actualizar los datos de la tabla",
      updated: (when: string) => `Actualizado ${when}`,
      justNow: "hace un momento",
      never: "Sin actualizar todavía",
      tooltip: (datetime: string) => `Última actualización: ${datetime}`,
      refreshing: "Actualizando datos…",
      refreshed: "Datos actualizados",
    },
  },
};

/** The round trip, wired: click and the strip goes busy for a second. */
export const Interactivo: Story = {
  render: () => {
    const [updatedAt, setUpdatedAt] = useState(() => Date.now() - 8 * MINUTE);
    const [isRefreshing, setIsRefreshing] = useState(false);

    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <TableFreshnessBar
          updatedAt={updatedAt}
          isRefreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            window.setTimeout(() => {
              setUpdatedAt(Date.now());
              setIsRefreshing(false);
            }, 1_000);
          }}
        />
        <p className="px-4 py-6 text-sm text-gray-500 dark:text-slate-400">
          The table body goes here.
        </p>
      </div>
    );
  },
};
