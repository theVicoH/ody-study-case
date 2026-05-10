import { MenuPage } from "./menu-page.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MenuPage> = {
  title: "Components/Organisms/MenuPage",
  component: MenuPage,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof MenuPage>;

const labels = {
  empty: "Empty",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  search: "Search",
  sectionMenus: "Menus",
  sectionDishes: "Dishes",
  columnName: "Name",
  columnCategory: "Category",
  columnPrice: "Price",
  columnDishes: "Dishes",
  columnActive: "Active",
  active: "Yes",
  inactive: "No"
};

export const Default: Story = {
  args: {
    labels,
    menus: [{ id: "m1", name: "Formule midi", priceCents: 2500, dishCount: 3, isActive: true }],
    dishes: [{ id: "d1", name: "Burger", category: "main", priceCents: 1200, isActive: true }]
  }
};
