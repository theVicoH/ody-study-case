import { SheetRestaurantOverview } from "./sheet-restaurant-overview.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof SheetRestaurantOverview> = {
  title: "Components/Organisms/SheetRestaurantOverview",
  component: SheetRestaurantOverview,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetRestaurantOverview>;

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
  clickAndCollect: "Click & Collect",
  vsGroupTitle: "Vs group average",
  vsGroupCaption: "Today's revenue",
  vsGroupRevenue: "Your revenue",
  vsGroupCovers: "Your covers",
  vsGroupTicket: "Your avg ticket",
  groupAverage: "Group average",
  coversUnit: (count: number): string => `${count} covers`,
  topDishes: "Top dishes",
  colDish: "Dish",
  colSold: "Sold",
  soldWord: "sold",
  emptyTopDishes: "No data yet."
};

const groupRestaurants = [
  { id: "r1", name: "Le Bistro", performance: "good" as const, revenue: 4200, sparklineData: [10, 14, 12, 18, 22, 20, 25] },
  { id: "r2", name: "La Brasserie", performance: "bad" as const, revenue: 1100, sparklineData: [8, 6, 5, 7, 4, 3, 2] },
  { id: "r3", name: "Café Central", performance: "warn" as const, revenue: 2800, sparklineData: [12, 10, 11, 13, 9, 14, 15] },
  { id: "r4", name: "Chez Marc", performance: "good" as const, revenue: 3600, sparklineData: [15, 18, 17, 20, 22, 19, 21] }
];

const topItems = [
  { name: "Entrecôte grillée", category: "Plats", price: 28.5, sold: 142 },
  { name: "Tartare de saumon", category: "Entrées", price: 16.0, sold: 98 },
  { name: "Crème brûlée", category: "Desserts", price: 9.5, sold: 87 },
  { name: "Verre de Bordeaux", category: "Boissons", price: 7.0, sold: 201 },
  { name: "Salade César", category: "Entrées", price: 13.0, sold: 74 }
];

export const Good: Story = {
  args: {
    labels: baseLabels,
    restaurantId: "r1",
    restaurantType: "Bistro",
    performance: "good",
    stats: {
      covers: 87,
      revenue: 4200,
      orders: 64,
      rating: "4.7",
      trend: "+12%"
    },
    phone: "+33 1 42 60 12 34",
    maxCovers: 80,
    tableService: true,
    clickAndCollect: true,
    groupRestaurants,
    topItems
  }
};

export const Bad: Story = {
  args: {
    labels: baseLabels,
    restaurantId: "r2",
    restaurantType: "Brasserie",
    performance: "bad",
    stats: {
      covers: 32,
      revenue: 1100,
      orders: 28,
      rating: "3.2",
      trend: "-8%"
    },
    phone: "+33 1 44 76 87 21",
    maxCovers: 120,
    tableService: true,
    clickAndCollect: false,
    groupRestaurants,
    topItems
  }
};

export const EmptyTopDishes: Story = {
  args: {
    labels: baseLabels,
    restaurantId: "r3",
    restaurantType: "Café",
    performance: "warn",
    stats: {
      covers: 45,
      revenue: 2800,
      orders: 38,
      rating: "4.1",
      trend: "+2%"
    },
    groupRestaurants
  }
};

export const Loading: Story = {
  render: () => (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
};

export const Empty: Story = {
  args: {
    labels: baseLabels,
    restaurantId: "r4",
    restaurantType: "—",
    performance: "warn",
    stats: {
      covers: 0,
      revenue: 0,
      orders: 0,
      rating: "—",
      trend: "0%"
    },
    groupRestaurants: [],
    topItems: []
  }
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load restaurant overview. Please try again.
    </div>
  )
};
