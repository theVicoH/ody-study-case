import { CustomersTable } from "./customers-table.organism";

import type { Meta, StoryObj } from "@storybook/react";
import type { RestaurantCustomer } from "@workspace/client";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof CustomersTable> = {
  title: "Components/Organisms/CustomersTable",
  component: CustomersTable,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof CustomersTable>;

const CUSTOMERS: ReadonlyArray<RestaurantCustomer> = [
  { id: "c1", name: "Alice Martin", email: "alice@example.com", visits: 12, spent: 480.5, tag: "VIP" },
  { id: "c2", name: "Bob Durand", email: "bob@example.com", visits: 5, spent: 120, tag: "Regular" },
  { id: "c3", name: "Carla Petit", email: "carla@example.com", visits: 1, spent: 35, tag: "New" },
  { id: "c4", name: "Daniel Roux", email: "daniel@example.com", visits: 18, spent: 920, tag: "VIP" },
  { id: "c5", name: "Emma Bernard", email: "emma@example.com", visits: 4, spent: 88, tag: "Regular" }
];

const labels = {
  colCustomer: "Customer",
  colVisits: "Visits",
  colSpent: "Spent",
  colTag: "Tag",
  tagVip: "VIP",
  tagRegular: "Regular",
  tagNew: "New",
  empty: "No customers match the filters.",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  visitsWord: "visits"
};

export const Default: Story = {
  render: () => (
    <div className="h-[500px] w-[700px]">
      <CustomersTable customers={CUSTOMERS} labels={labels} />
    </div>
  )
};

export const Loading: Story = {
  render: () => (
    <div className="space-y-2 h-[500px] w-[700px]">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
};

export const Empty: Story = {
  render: () => (
    <div className="h-[500px] w-[700px]">
      <CustomersTable customers={[]} labels={labels} />
    </div>
  )
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load customers. Please try again.
    </div>
  )
};
