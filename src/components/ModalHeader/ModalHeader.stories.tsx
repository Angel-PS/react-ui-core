import type { Meta, StoryObj } from "@storybook/react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { ModalHeader } from "./ModalHeader";

const meta: Meta<typeof ModalHeader> = {
  title: "Overlays/ModalHeader",
  component: ModalHeader,
  args: {
    isEdit: false,
    id: 42,
    title: "Edit role",
    createTitle: "New role",
    subtitle: "Choose what members of this role can do",
    icon: faUsers,
    onClose: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ModalHeader>;

export const Create: Story = {};
export const Edit: Story = { args: { isEdit: true } };
export const Dark: Story = {
  args: { isEdit: true },
  decorators: [
    (Story) => (
      <div className="dark rounded-xl bg-slate-950 p-6">
        <Story />
      </div>
    ),
  ],
};
