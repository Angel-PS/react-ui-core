import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InputCheckbox, InputToggle } from "./InputCheckbox";

const meta: Meta<typeof InputCheckbox> = {
  title: "Components/InputCheckbox",
  component: InputCheckbox,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputCheckbox>;

export const Default: Story = {
  args: { id: "terms", label: "I accept the terms" },
};

export const Checked: Story = {
  args: { id: "checked", label: "Checked", defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { id: "mixed", label: "Some selected", indeterminate: true },
};

export const Compact: Story = {
  args: { id: "compact", label: "Compact (18px)", compact: true },
};

/** A "select all" over a checklist: the tri-state header is `indeterminate`. */
export const SelectAllChecklist: Story = {
  name: "Select all + compact checklist",
  render: () => {
    const items = ["Invoice", "Customer", "Total", "Status"];
    const [picked, setPicked] = useState<string[]>(["Invoice", "Total"]);
    const all = picked.length === items.length;
    const some = picked.length > 0 && !all;
    return (
      <div className="flex flex-col gap-2">
        <InputCheckbox
          id="all"
          compact
          label="All columns"
          checked={all}
          indeterminate={some}
          onChange={() => setPicked(all ? [] : items)}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item) => (
            <InputCheckbox
              key={item}
              id={`col-${item}`}
              compact
              label={item}
              checked={picked.includes(item)}
              onChange={() =>
                setPicked((p) =>
                  p.includes(item) ? p.filter((x) => x !== item) : [...p, item],
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Toggle: StoryObj<typeof InputToggle> = {
  render: () => <InputToggle id="toggle" label="Enable notifications" />,
};
