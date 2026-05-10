import { ConnectedOverview } from "./connected-overview.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ConnectedOverview> = {
  title: "Components/Connected/ConnectedOverview",
  component: ConnectedOverview,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof ConnectedOverview>;

const baseLabels = {
  covers: "Covers",
  revenue: "Revenue",
  orders: "Orders",
  rating: "Rating",
  openOrders: "Open orders",
  fillRate: "Fill rate",
  revenueTrend: "Revenue trend",
  trend24h: "24h",
  establishmentDetails: "Establishment details",
  type: "Type",
  phone: "Phone",
  capacity: "Capacity",
  services: "Services",
  tableService: "Table service",
  clickAndCollect: "Click & collect",
  vsGroupTitle: "vs. Group",
  vsGroupCaption: "Performance comparison",
  vsGroupRevenue: "Revenue",
  vsGroupCovers: "Covers",
  vsGroupTicket: "Avg ticket",
  groupAverage: "Group average",
  coversUnit: (count: number): string => `${count} covers`,
  topDishes: "Top dishes",
  colDish: "Dish",
  colSold: "Sold",
  soldWord: "sold",
  emptyTopDishes: "No data"
};

const baseRestaurant = {
  id: "r1",
  name: "Atelier Nord",
  type: "Atelier",
  address: "12 rue de Turenne, Paris 3e",
  performance: "good" as const,
  shape: "box" as const,
  position: { x: 0, z: 0 },
  dimensions: { width: 3, depth: 3, height: 3 },
  colors: { primary: 0x8442ff, accent: 0xff3eb5 },
  model: ""
};

const baseSettings = {
  name: "Atelier Nord",
  address: "12 rue de Turenne, Paris 3e",
  phone: "+33 1 42 18 30 22",
  maxCovers: 84,
  tableService: true,
  clickAndCollect: false,
  kitchenNotifications: true,
  testMode: false
};

export const Loading: Story = {
  args: {
    restaurantId: "loading-id",
    restaurant: baseRestaurant,
    settings: baseSettings,
    labels: baseLabels
  }
};

export const WithSettings: Story = {
  args: {
    restaurantId: "r1",
    restaurant: baseRestaurant,
    settings: baseSettings,
    labels: baseLabels,
    groupRestaurants: [
      { id: "r1", name: "Atelier Nord", performance: "good", revenue: 4200 },
      { id: "r2", name: "Maison Belleville", performance: "warn", revenue: 3100 },
      { id: "r3", name: "Le Comptoir d'Or", performance: "good", revenue: 5500 }
    ]
  }
};

export const NoSettings: Story = {
  args: {
    restaurantId: "r1",
    restaurant: baseRestaurant,
    settings: null,
    labels: baseLabels
  }
};
