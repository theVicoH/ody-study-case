import { SheetOrganizationSettings } from "./sheet-organization-settings.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SheetOrganizationSettings> = {
  title: "Components/Organisms/SheetOrganizationSettings",
  component: SheetOrganizationSettings,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetOrganizationSettings>;

const LABELS = {
  generalInfo: "Organization settings",
  orgName: "Organization name",
  owner: "Owner",
  restaurants: "Restaurants",
  restaurantsEmpty: "No restaurants yet.",
  deleteRestaurant: "Delete restaurant",
  deleteRestaurantDesc: "Permanently delete {{name}}? This action cannot be undone.",
  cancel: "Cancel",
  confirm: "Delete",
  save: "Save changes",
  saved: "Saved!"
};

const RESTAURANTS = [
  { id: "1", name: "Le Bistrot du Coin", address: "12 rue de la Paix, Paris" },
  { id: "2", name: "Chez Marcel", address: "45 avenue Victor Hugo, Lyon" },
  { id: "3", name: "La Brasserie du Port", address: "8 quai des Belges, Marseille" }
];

export const Default: Story = {
  args: {
    labels: LABELS,
    orgName: "My Restaurant Group",
    ownerEmail: "owner@example.com",
    restaurants: RESTAURANTS
  }
};

export const Empty: Story = {
  args: {
    labels: LABELS,
    orgName: "Solo Bistro",
    ownerEmail: "solo@example.com",
    restaurants: []
  }
};
