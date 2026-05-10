import { OrdersTable } from "./orders-table.organism";

import type { Meta, StoryObj } from "@storybook/react";
import type { RestaurantOrder } from "@workspace/client";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof OrdersTable> = {
  title: "Components/Organisms/OrdersTable",
  component: OrdersTable,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof OrdersTable>;

const ORDERS: ReadonlyArray<RestaurantOrder> = [
  { id: "#1074", table: 3, items: 2, total: 96.36, status: "paid", when: "just now" },
  { id: "#1068", table: 7, items: 5, total: 70.80, status: "served", when: "2m" },
  { id: "#1105", table: 12, items: 2, total: 71.88, status: "preparing", when: "6m" },
  { id: "#1115", table: 4, items: 5, total: 44.16, status: "served", when: "11m" },
  { id: "#1047", table: 9, items: 2, total: 44.52, status: "ready", when: "18m" },
  { id: "#1076", table: 1, items: 4, total: 78.72, status: "served", when: "25m" },
  { id: "#1042", table: 14, items: 4, total: 24.36, status: "ready", when: "34m" },
  { id: "#1072", table: 6, items: 5, total: 109.68, status: "preparing", when: "48m" },
  { id: "#1071", table: 11, items: 4, total: 39.48, status: "served", when: "1h" }
];

const labels = {
  colTable: "Table",
  colOrder: "Order",
  colItems: "Items",
  colTotal: "Total",
  colStatus: "Status",
  colTime: "Time",
  itemsWord: "items",
  empty: "No orders match the filters.",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  statusNew: "New",
  statusPreparing: "Preparing",
  statusReady: "Ready",
  statusServed: "Served",
  statusPaid: "Paid"
};

export const Default: Story = {
  render: () => (
    <div className="h-[500px] w-[700px]">
      <OrdersTable orders={ORDERS} labels={labels} pageSize={5} />
    </div>
  )
};

export const Narrow: Story = {
  render: () => (
    <div className="h-[500px] w-[400px]">
      <OrdersTable orders={ORDERS} labels={labels} pageSize={5} />
    </div>
  )
};
