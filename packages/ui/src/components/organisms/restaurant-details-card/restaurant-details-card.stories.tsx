import { RestaurantDetailsCard } from "./restaurant-details-card.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantDetailsCard> = {
  title: "Components/Organisms/RestaurantDetailsCard",
  component: RestaurantDetailsCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantDetailsCard>;

const labels = {
  title: "Establishment",
  type: "Type",
  phone: "Phone",
  capacity: "Capacity",
  services: "Services",
  tableService: "Table service",
  clickAndCollect: "Click & collect",
  coversUnit: (count: number) => `${count} covers`
};

export const Full: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantDetailsCard
        labels={labels}
        restaurantType="Bistro"
        phone="01 23 45 67 89"
        maxCovers={80}
        tableService
        clickAndCollect
      />
    </div>
  )
};

export const Minimal: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantDetailsCard
        labels={labels}
        restaurantType="Bistro"
        phone="01 23 45 67 89"
      />
    </div>
  )
};
