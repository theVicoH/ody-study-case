import { RestaurantDetailsCard } from "./restaurant-details-card.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

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

export const Loading: Story = {
  render: () => (
    <div className="p-md max-w-md space-y-2">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load restaurant details. Please try again.
    </div>
  )
};
