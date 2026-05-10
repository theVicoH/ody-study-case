import { CrmPage } from "./crm-page.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CrmPage> = {
  title: "Components/Organisms/CrmPage",
  component: CrmPage,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof CrmPage>;

const labels = {
  empty: "No clients",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  search: "Search",
  columnName: "Name",
  columnEmail: "Email",
  columnPhone: "Phone",
  columnOrders: "Orders",
  columnTotal: "Total"
};

export const Default: Story = {
  args: {
    labels,
    clients: [
      { id: "1", firstName: "Anne", lastName: "Martin", email: "a@b.cd", phone: null, ordersCount: 3, totalSpentCents: 5400 },
      { id: "2", firstName: "Jean", lastName: "Petit", email: null, phone: "0600000000", ordersCount: 1, totalSpentCents: 1800 }
    ]
  }
};
