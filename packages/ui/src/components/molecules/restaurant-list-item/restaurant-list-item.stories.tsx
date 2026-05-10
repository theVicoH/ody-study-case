import { RestaurantListItem } from "./restaurant-list-item.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantListItem> = {
  title: "Components/Molecules/RestaurantListItem",
  component: RestaurantListItem,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof RestaurantListItem>;

export const Default: Story = {
  args: { name: "Bistro Saint-Roch", caption: "12 rue Saint-Roch", status: "good" }
};

export const Active: Story = {
  args: { name: "Bistro Saint-Roch", caption: "12 rue Saint-Roch", status: "good", active: true }
};

export const Group: Story = {
  args: { name: "All restaurants", caption: "Group overview", tone: "group" }
};

export const List: Story = {
  render: () => (
    <div className="bg-card flex w-72 flex-col gap-0.5 rounded-lg p-2">
      <RestaurantListItem name="All restaurants" caption="Group overview" tone="group" active />
      <RestaurantListItem name="Bistro Saint-Roch" caption="12 rue Saint-Roch" status="good" />
      <RestaurantListItem name="Le Marais" caption="8 rue de Rivoli" status="warn" />
      <RestaurantListItem name="Café Nord" caption="22 boulevard Hugo" status="bad" />
    </div>
  )
};
