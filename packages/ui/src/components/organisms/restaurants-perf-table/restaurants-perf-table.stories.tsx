import { RestaurantsPerfTable } from "./restaurants-perf-table.organism";

import type { RestaurantPerfRow } from "./restaurants-perf-table.organism";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantsPerfTable> = {
  title: "Components/Organisms/RestaurantsPerfTable",
  component: RestaurantsPerfTable,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof RestaurantsPerfTable>;

const RESTAURANTS: ReadonlyArray<RestaurantPerfRow> = [
  { id: "r1", name: "Café Lumière", performance: "good", revenue: 12450, sparklineData: [5, 7, 6, 9, 11, 10, 14] },
  { id: "r2", name: "La Tivoli", performance: "warn", revenue: 8230, sparklineData: [10, 8, 9, 7, 6, 5, 4] },
  { id: "r3", name: "Bistrot Marché", performance: "good", revenue: 15700, sparklineData: [3, 5, 8, 9, 12, 14, 17] },
  { id: "r4", name: "L'Atelier", performance: "bad", revenue: 4100, sparklineData: [8, 7, 5, 4, 3, 2, 2] }
];

const labels = {
  colStatus: "•",
  colRestaurant: "Restaurant",
  colTrend: "Trend",
  colRevenue: "Revenue",
  empty: "No restaurants match the filters.",
  previous: "Previous",
  next: "Next",
  filterAll: "All",
  perfGood: "Good",
  perfWarn: "Warn",
  perfBad: "Bad"
};

export const Default: Story = {
  render: () => (
    <div className="h-[500px] w-[700px]">
      <RestaurantsPerfTable restaurants={RESTAURANTS} labels={labels} />
    </div>
  )
};
