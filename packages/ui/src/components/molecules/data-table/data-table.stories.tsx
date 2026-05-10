import { DataTable } from "./data-table.molecule";

import type { DataTableColumn } from "./data-table.molecule";
import type { Meta, StoryObj } from "@storybook/react";

interface Person {
  id: string;
  name: string;
  role: string;
  team: "Frontend" | "Backend" | "Design";
}

const meta: Meta<typeof DataTable<Person>> = {
  title: "Components/Molecules/DataTable",
  component: DataTable,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof DataTable<Person>>;

const PEOPLE: ReadonlyArray<Person> = [
  { id: "1", name: "Alice", role: "Engineer", team: "Frontend" },
  { id: "2", name: "Bob", role: "Engineer", team: "Backend" },
  { id: "3", name: "Carol", role: "Designer", team: "Design" },
  { id: "4", name: "Dan", role: "Engineer", team: "Frontend" },
  { id: "5", name: "Eve", role: "Engineer", team: "Backend" },
  { id: "6", name: "Frank", role: "PM", team: "Design" },
  { id: "7", name: "Grace", role: "Engineer", team: "Frontend" },
  { id: "8", name: "Heidi", role: "Engineer", team: "Backend" },
  { id: "9", name: "Ivan", role: "Designer", team: "Design" },
  { id: "10", name: "Judy", role: "Engineer", team: "Frontend" }
];

const columns: ReadonlyArray<DataTableColumn<Person>> = [
  { id: "name", header: "Name", cell: (p) => p.name },
  { id: "role", header: "Role", cell: (p) => p.role },
  {
    id: "team",
    header: "Team",
    cell: (p) => p.team,
    filter: {
      getValue: (p) => p.team,
      options: [
        { label: "Frontend", value: "Frontend" },
        { label: "Backend", value: "Backend" },
        { label: "Design", value: "Design" }
      ]
    }
  }
];

export const Default: Story = {
  render: () => (
    <div className="h-[400px] w-[600px]">
      <DataTable
        data={PEOPLE}
        columns={columns}
        rowKey={(p) => p.id}
        pageSize={4}
        labels={{
          empty: "No data",
          previous: "Previous",
          next: "Next",
          filterAll: "All"
        }}
      />
    </div>
  )
};
