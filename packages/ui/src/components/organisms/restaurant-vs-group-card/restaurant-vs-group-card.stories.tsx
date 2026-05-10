import { RestaurantVsGroupCard } from "./restaurant-vs-group-card.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantVsGroupCard> = {
  title: "Components/Organisms/RestaurantVsGroupCard",
  component: RestaurantVsGroupCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantVsGroupCard>;

const labels = {
  title: "Versus group",
  caption: "Last 7d",
  revenue: "Revenue",
  groupAverage: "Group average"
};

const formatRevenue = (value: number): string => `€${value.toLocaleString("fr-FR")}`;

export const AboveAverage: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantVsGroupCard
        labels={labels}
        ownRevenue={48_500}
        groupRestaurants={[
          { id: "a", revenue: 30_000 },
          { id: "b", revenue: 32_000 },
          { id: "c", revenue: 35_000 }
        ]}
        formatRevenue={formatRevenue}
      />
    </div>
  )
};

export const BelowAverage: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantVsGroupCard
        labels={labels}
        ownRevenue={20_000}
        groupRestaurants={[
          { id: "a", revenue: 30_000 },
          { id: "b", revenue: 32_000 },
          { id: "c", revenue: 35_000 }
        ]}
        formatRevenue={formatRevenue}
      />
    </div>
  )
};
