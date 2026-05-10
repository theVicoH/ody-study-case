import { OrdersPage } from "./orders-page.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof OrdersPage> = {
  title: "Components/Organisms/OrdersPage",
  component: OrdersPage,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof OrdersPage>;

const labels = {
  empty: "No orders",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  search: "Search",
  columnReference: "Ref",
  columnClient: "Client",
  columnStatus: "Status",
  columnItems: "Items",
  columnTotal: "Total",
  columnDate: "Date",
  statusLabels: {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    paid: "Paid",
    cancelled: "Cancelled"
  }
};

export const Default: Story = {
  args: {
    labels,
    orders: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        clientName: "Anne Martin",
        status: "preparing",
        itemCount: 3,
        totalCents: 4500,
        placedAt: new Date().toISOString()
      }
    ]
  }
};
