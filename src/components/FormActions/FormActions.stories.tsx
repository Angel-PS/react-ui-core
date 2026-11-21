import type { Meta, StoryObj } from "@storybook/react";
import { FormActions } from "./FormActions";

const meta: Meta<typeof FormActions> = {
  title: "Forms/FormActions",
  component: FormActions,
  args: { onCancel: () => {} },
};
export default meta;
type Story = StoryObj<typeof FormActions>;

export const Create: Story = {};
export const Edit: Story = { args: { isEdit: true } };
export const Pending: Story = { args: { isPending: true } };
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6" style={{ maxWidth: 420 }}>
      <FormActions {...args} />
    </div>
  ),
};
