import { SheetOrders } from "./sheet-orders.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SheetOrders> = {
  title: "Components/Organisms/SheetOrders",
  component: SheetOrders,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetOrders>;

export const Default: Story = {
  args: {
    orders: [
      {
        id: "#001",
        table: 4,
        items: 3,
        total: 58.5,
        status: "new",
        when: "14:32"
      },
      {
        id: "#002",
        table: 7,
        items: 5,
        total: 112.0,
        status: "preparing",
        when: "14:15"
      },
      {
        id: "#003",
        table: 2,
        items: 2,
        total: 34.0,
        status: "ready",
        when: "14:05"
      },
      {
        id: "#004",
        table: 9,
        items: 4,
        total: 76.5,
        status: "served",
        when: "13:50"
      },
      {
        id: "#005",
        table: 1,
        items: 6,
        total: 145.0,
        status: "paid",
        when: "13:30"
      }
    ]
  }
};

export const Empty: Story = {
  args: {
    orders: []
  }
};
