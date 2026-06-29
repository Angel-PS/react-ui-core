import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Interactivo: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    return (
      <Pagination
        count={420}
        currentPage={page}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setSize(s);
          setPage(1);
        }}
      />
    );
  },
};

export const ManyPages: Story = {
  name: "Muchas páginas",
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        count={1000}
        currentPage={page}
        pageSize={25}
        onPageChange={setPage}
      />
    );
  },
};
