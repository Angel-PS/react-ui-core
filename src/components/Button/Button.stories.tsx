import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "classic",
        "cancel",
        "active-filter",
        "inactive-filter",
        "toolbar-button",
        "segment-active",
        "segment-inactive",
        "segment-brand-active",
        "segment-brand-inactive",
        "link",
        "chip",
        "fab",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Guardar", variant: "primary" } };
export const Secondary: Story = { args: { children: "Secundario", variant: "secondary" } };
export const Classic: Story = { args: { children: "Clásico", variant: "classic" } };
export const Cancel: Story = { args: { children: "Eliminar", variant: "cancel" } };
export const Loading: Story = { args: { children: "Guardando…", loading: true } };
export const Disabled: Story = { args: { children: "Deshabilitado", disabled: true } };

export const Todas: Story = {
  name: "Todas las variantes",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="classic">Classic</Button>
      <Button variant="cancel">Cancel</Button>
      <Button variant="active-filter">Active filter</Button>
      <Button variant="inactive-filter">Inactive filter</Button>
    </div>
  ),
};

const PERIODS = ["Day", "Week", "Month", "Year"];

/** One-of-N switcher on a recessed track (`segment-active` / `segment-inactive`). */
export const Segmented: Story = {
  name: "Segmented control",
  render: () => {
    const [active, setActive] = useState("Week");
    return (
      <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-slate-800">
        {PERIODS.map((p) => (
          <Button
            key={p}
            type="button"
            aria-pressed={active === p}
            variant={active === p ? "segment-active" : "segment-inactive"}
            onClick={() => setActive(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    );
  },
};

/**
 * Segments that sit ON a brand-gradient surface. The surface is
 * theme-invariant, so these have no `dark:` variants; the track must be
 * `bg-black/30`.
 */
export const SegmentedOnBrand: Story = {
  name: "Segmented control (on brand surface)",
  render: () => {
    const [active, setActive] = useState("Month");
    return (
      <div className="rounded-2xl bg-linear-to-br from-primary-blue-darker via-primary-blue-default to-primary-blue-hover p-6">
        <div className="inline-flex gap-1 rounded-lg bg-black/30 p-1">
          {PERIODS.map((p) => (
            <Button
              key={p}
              type="button"
              aria-pressed={active === p}
              variant={
                active === p ? "segment-brand-active" : "segment-brand-inactive"
              }
              onClick={() => setActive(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

/** An inline text action inside a sentence. */
export const Link: Story = {
  render: () => (
    <p className="text-sm text-gray-700 dark:text-slate-300">
      List price: US$ 39.00 ·{" "}
      <Button type="button" variant="link">
        Use
      </Button>
    </p>
  ),
};

/** A status pill that is also a trigger; the tone comes from `className`. */
export const Chip: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="chip"
        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      >
        Accepted
      </Button>
      <Button
        type="button"
        variant="chip"
        className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
      >
        Pending
      </Button>
    </div>
  ),
};

/** Floating action button: icon-only, always with an `aria-label`. */
export const Fab: Story = {
  name: "FAB",
  render: () => (
    <Button type="button" variant="fab" aria-label="Open assistant">
      <FontAwesomeIcon icon={faWandMagicSparkles} />
    </Button>
  ),
};
