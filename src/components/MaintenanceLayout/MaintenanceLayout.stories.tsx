import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MaintenanceLayout } from "./MaintenanceLayout";
import { useFilterController, type FilterDef } from "../Filters";
import type {
  HeaderColumn,
  RowColumn,
  TableColumnPref,
} from "../../types";

const meta: Meta<typeof MaintenanceLayout> = {
  title: "Layout/MaintenanceLayout",
  component: MaintenanceLayout,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MaintenanceLayout>;

const headers: HeaderColumn[] = [
  { value: "Cliente", accessor: "name", sortKey: "name", locked: true },
  { value: "Correo", accessor: "email" },
  { value: "Estado", accessor: "status" },
];

const rows: RowColumn[] = [
  {
    id: 1,
    columns: [
      { value: "Alice Pérez", accessor: "name" },
      { value: "alice@acme.com", accessor: "email" },
      { value: "active", accessor: "status", dataType: "status" },
    ],
  },
  {
    id: 2,
    columns: [
      { value: "Bob Núñez", accessor: "name" },
      { value: "bob@acme.com", accessor: "email" },
      { value: "inactive", accessor: "status", dataType: "status" },
    ],
  },
];

const filterDefs: FilterDef[] = [
  {
    kind: "segmented",
    key: "status",
    options: [
      { value: "", label: "Todos" },
      { value: "active", label: "Activos" },
      { value: "inactive", label: "Inactivos" },
    ],
  },
  {
    kind: "select",
    key: "branch",
    label: "Sucursal",
    options: [
      { value: "", label: "Todas" },
      { value: "1", label: "Principal" },
    ],
  },
];

export const Page: Story = {
  name: "Modo página (controlado)",
  render: () => {
    const filters = useFilterController(filterDefs);
    const [sort, setSort] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [columnPref, setColumnPref] = useState<TableColumnPref | undefined>();
    return (
      <MaintenanceLayout
        maintenanceType="page"
        title="Clientes"
        description="Administra los clientes registrados"
        createPath="/clientes/nuevo"
        editPath="/clientes/editar"
        onNavigate={(path) => alert(`navigate → ${path}`)}
        headers={headers}
        data={rows}
        canEdit
        canDelete
        onDelete={async (id) => alert(`delete ${id}`)}
        tableKey="customers"
        columnPref={columnPref}
        onColumnChange={setColumnPref}
        filters={filters}
        searchBar={{ placeholder: "Buscar clientes…", totalCount: rows.length }}
        searchValue={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />
    );
  },
};
