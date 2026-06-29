import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const meta: Meta<typeof LanguageSwitcher> = {
  title: "App Shell/Navbar Widgets/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState("es");
    return (
      <LanguageSwitcher
        current={current}
        onChange={setCurrent}
        languages={[
          { code: "es", label: "Español" },
          { code: "en", label: "English" },
        ]}
      />
    );
  },
};
