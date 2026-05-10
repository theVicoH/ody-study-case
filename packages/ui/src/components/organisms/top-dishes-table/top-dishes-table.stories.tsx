import { TopDishesTable } from "./top-dishes-table.organism";

import type { Meta, StoryObj } from "@storybook/react";

interface RestaurantTopItem {
  name: string;
  category: string;
  price: number;
  sold: number;
}

const meta: Meta<typeof TopDishesTable> = {
  title: "Components/Organisms/TopDishesTable",
  component: TopDishesTable,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof TopDishesTable>;

const ITEMS: ReadonlyArray<RestaurantTopItem> = [
  { name: "Pasta Carbonara", category: "Plats", price: 14.5, sold: 124 },
  { name: "Pizza Margherita", category: "Plats", price: 12, sold: 98 },
  { name: "Tiramisu", category: "Desserts", price: 7.5, sold: 76 },
  { name: "Salade César", category: "Entrées", price: 9.5, sold: 60 },
  { name: "Spritz", category: "Boissons", price: 8, sold: 55 }
];

const labels = {
  colRank: "#",
  colDish: "Dish",
  colCategory: "Category",
  colPrice: "Price",
  colSold: "Sold",
  empty: "No dishes match the filters.",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  soldWord: "sold"
};

export const Default: Story = {
  render: () => (
    <div className="h-[500px] w-[700px]">
      <TopDishesTable items={ITEMS} labels={labels} />
    </div>
  )
};
