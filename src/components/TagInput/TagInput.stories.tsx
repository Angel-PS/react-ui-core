import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagInput } from "./TagInput";
import type { TagInputProps } from "./TagInput";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagInput>;

const isUrl = (v: string) => /^https?:\/\/\S+$/.test(v);

const Controlled = (args: Partial<TagInputProps>) => {
  const [tags, setTags] = useState<string[]>(args.value ?? []);
  return (
    <div className="max-w-md">
      <TagInput {...args} value={tags} onChange={setTags} />
    </div>
  );
};

export const RedirectUris: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "redirect-uris",
    label: "Redirect URIs",
    required: true,
    value: ["https://app.example.com/callback", "http://localhost:5173/callback"],
    placeholder: "Add a URI and press Enter",
    validate: isUrl,
    invalidMessage: "Enter a full URL, e.g. https://…",
    hint: "One per tag. Backspace on an empty field removes the last one.",
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "origins", label: "Allowed origins", placeholder: "Add an origin and press Enter" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { name: "disabled", label: "Redirect URIs", value: ["https://app.example.com"], disabled: true },
};

export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-xl bg-slate-950 p-6">
      <Controlled
        {...args}
        name="dark"
        label="Redirect URIs"
        value={["https://app.example.com/callback"]}
        validate={isUrl}
        placeholder="Add a URI and press Enter"
      />
    </div>
  ),
};
