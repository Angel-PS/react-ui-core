import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table } from "./Table";
import type {
  HeaderColumn,
  RowColumn,
  TableAction,
  ExpandField,
} from "../../types";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const headers: HeaderColumn[] = [
  { value: "Cliente", accessor: "name", sortKey: "name" },
  { value: "Correo", accessor: "email" },
  { value: "Total", accessor: "total", justify: "right" },
  { value: "Estado", accessor: "status" },
];

const data: RowColumn[] = [
  {
    id: 1,
    columns: [
      {
        value: "Alice Pérez",
        accessor: "name",
        dataType: "avatar",
        subValue: "alice@acme.com",
      },
      { value: "alice@acme.com", accessor: "email" },
      { value: 1234.5, accessor: "total", dataType: "decimal", justify: "right" },
      { value: "paid", accessor: "status", dataType: "status" },
    ],
    expandData: { Notas: "Cliente VIP", Teléfono: "809-555-0101" },
  },
  {
    id: 2,
    columns: [
      {
        value: "Bob Núñez",
        accessor: "name",
        dataType: "avatar",
        subValue: "bob@acme.com",
      },
      { value: "bob@acme.com", accessor: "email" },
      { value: 89.9, accessor: "total", dataType: "decimal", justify: "right" },
      { value: "pending", accessor: "status", dataType: "status" },
    ],
    expandData: { Notas: "Pago atrasado" },
  },
];

const expandFields: ExpandField[] = [
  { label: "Notas", accessor: "Notas" },
  { label: "Teléfono", accessor: "Teléfono" },
];

const actions: TableAction[] = [
  {
    label: "Editar",
    icon: <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
  {
    label: "Eliminar",
    icon: <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />,
    onClick: () => {},
    variant: "danger",
  },
];

export const Default: Story = {
  render: () => {
    const [sort, setSort] = useState<string | null>(null);
    return (
      <Table
        headers={headers}
        data={data}
        actions={actions}
        expandFields={expandFields}
        sort={sort}
        onSortChange={setSort}
      />
    );
  },
};

export const Cargando: Story = {
  name: "Estado de carga",
  render: () => <Table headers={headers} data={[]} isLoading />,
};

export const Vacio: Story = {
  name: "Sin registros",
  render: () => <Table headers={headers} data={[]} />,
};
