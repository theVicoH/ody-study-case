import { SheetStats } from "./sheet-stats.organism";

import type { Meta, StoryObj } from "@storybook/react";
import type { RestaurantDetailedStats } from "@workspace/client";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof SheetStats> = {
  title: "Components/Organisms/SheetStats",
  component: SheetStats,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof SheetStats>;

const mockStats: RestaurantDetailedStats = {
  covers: 842,
  revenue: 28450,
  orders: 312,
  rating: "4.6",
  trend: "+8%",
  todayCovers: 124,
  todayRevenue: 4120,
  avgTicket: 34,
  fillRate: 0.78,
  weeklyRevenue: [3800, 4200, 3900, 5100, 4700, 6200, 5600],
  monthlyRevenue: [42000, 38000, 41000, 45000, 49000, 62000, 58000, 51000, 47000, 53000, 60000, 71000],
  yearlyRevenue: [480000, 510000, 540000, 580000, 612000],
  heatmap: [
    [0.1, 0.2, 0.15, 0.3, 0.25, 0.4, 0.35],
    [0.3, 0.5, 0.4, 0.6, 0.55, 0.75, 0.7],
    [0.6, 0.8, 0.7, 0.9, 0.85, 1.0, 0.95],
    [0.7, 0.85, 0.75, 0.95, 0.9, 0.8, 0.75],
    [0.4, 0.55, 0.5, 0.65, 0.6, 0.5, 0.45],
    [0.2, 0.3, 0.25, 0.35, 0.3, 0.25, 0.2]
  ],
  topItems: [
    { name: "Entrecôte maturée", category: "Plats", price: 38, sold: 124 },
    { name: "Burrata truffe", category: "Entrées", price: 22, sold: 98 },
    { name: "Moelleux chocolat", category: "Desserts", price: 12, sold: 87 },
    { name: "Côte de veau", category: "Plats", price: 42, sold: 72 },
    { name: "Carpaccio de boeuf", category: "Entrées", price: 18, sold: 65 }
  ],
  sparklineData: [42, 58, 45, 70, 55, 80, 65, 90, 75, 88, 60, 95, 72, 85, 68, 92, 78, 65, 82, 70, 88, 76, 91, 84],
  customers: 248,
  openOrders: 7
};

const mockLabels = {
  revenue7j: "Revenue (7d)",
  covers7j: "Covers (7d)",
  avgTicket: "Avg. ticket",
  fillRate: "Fill rate",
  todayCovers: "Today covers",
  openOrders: "Open orders",
  revenueTrend: "Revenue trend",
  trend24h: "Last 24h",
  weeklyRevenue: "Weekly revenue",
  last7Days: "Last 7 days",
  affluence: "Affluence",
  hoursVsDays: "Hours × days",
  topDishes: "Top dishes",
  soldWord: "sold",
  colRank: "#",
  colDish: "Dish",
  colCategory: "Category",
  colPrice: "Price",
  colSold: "Sold",
  empty: "No data",
  paginationPrev: "Prev",
  paginationNext: "Next",
  filterAll: "All",
  expandStats: "Expand",
  revenueTrendDialogTitle: "Revenue trend — hourly",
  revenueTrendDialogDescription: "Hour-by-hour revenue for the selected day.",
  weeklyRevenueDialogTitle: "Weekly revenue",
  weeklyRevenueDialogDescription: "Day-by-day revenue for the selected week.",
  affluenceDialogTitle: "Affluence",
  affluenceDialogDescription: "Hours × days fill rate for the selected week.",
  totalLabel: "Total",
  averageLabel: "Average",
  peakLabel: "Peak",
  bestLabel: "Best",
  worstLabel: "Worst",
  growthLabel: "Growth",
  peakHourLabel: "Peak hour",
  lowHourLabel: "Lowest hour",
  avgHourlyLabel: "Avg / hour",
  vsPriorLabel: "vs prior",
  timelineTitle: "Last 24h",
  weeklyTitle: "Last 7 days",
  fillRateAvgLabel: "Avg fill rate",
  peakSlotLabel: "Peak slot",
  quietSlotLabel: "Quietest slot",
  heatmapTitle: "Hours × days"
};

export const Default: Story = {
  args: {
    labels: mockLabels,
    stats: mockStats,
    restaurantId: "restaurant-1"
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};

const emptyStats: RestaurantDetailedStats = {
  covers: 0,
  revenue: 0,
  orders: 0,
  rating: "—",
  trend: "0%",
  todayCovers: 0,
  todayRevenue: 0,
  avgTicket: 0,
  fillRate: 0,
  weeklyRevenue: [],
  monthlyRevenue: [],
  yearlyRevenue: [],
  heatmap: [],
  topItems: [],
  sparklineData: [],
  customers: 0,
  openOrders: 0
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
    labels: mockLabels,
    stats: emptyStats,
    restaurantId: "restaurant-empty"
  }
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load statistics. Please try again.
    </div>
  )
};
