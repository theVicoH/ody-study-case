import { RestaurantLabel } from "./restaurant-label.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantLabel> = {
  title: "Components/Molecules/RestaurantLabel",
  component: RestaurantLabel,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantLabel>;

export const Good: Story = {
  args: {
    name: "Le Petit Bistro",
    address: "12 rue de la Paix, Paris",
    status: "good"
  }
};

export const Warn: Story = {
  args: {
    name: "Brasserie du Sud",
    address: "8 avenue Victor Hugo, Lyon",
    status: "warn"
  }
};

export const Bad: Story = {
  args: {
    name: "La Table Ronde",
    address: "3 place du Marché, Bordeaux",
    status: "bad"
  }
};
