import { RestaurantTopDishesCard } from "./restaurant-top-dishes-card.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantTopDishesCard> = {
  title: "Components/Organisms/RestaurantTopDishesCard",
  component: RestaurantTopDishesCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantTopDishesCard>;

const labels = {
  title: "Top dishes",
  soldWord: "sold",
  empty: "No data yet"
};

const ITEMS = [
  { name: "Burger", category: "Mains", sold: 124, price: 14.5 },
  { name: "Pizza Margherita", category: "Mains", sold: 98, price: 13 },
  { name: "Caesar salad", category: "Starters", sold: 76, price: 11 },
  { name: "Tiramisu", category: "Desserts", sold: 52, price: 7.5 },
  { name: "Latte", category: "Drinks", sold: 33, price: 4 }
];

export const Default: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantTopDishesCard labels={labels} items={ITEMS} />
    </div>
  )
};

export const Empty: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantTopDishesCard labels={labels} items={[]} />
    </div>
  )
};
