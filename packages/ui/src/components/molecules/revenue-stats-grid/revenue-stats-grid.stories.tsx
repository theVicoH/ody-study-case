import { RevenueStatsGrid } from "./revenue-stats-grid.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RevenueStatsGrid> = {
  title: "Components/Molecules/RevenueStatsGrid",
  component: RevenueStatsGrid,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RevenueStatsGrid>;

const REVENUE_THOUSAND = 1000;

const formatRevenue = (value: number): string =>
  value >= REVENUE_THOUSAND ? `€${(value / REVENUE_THOUSAND).toFixed(1)}k` : `€${Math.round(value)}`;

const HOURLY_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}h`);

const HOURLY_VALUES = [
  120, 95, 80, 60, 55, 45, 70, 110, 180, 240, 320, 480,
  620, 540, 360, 280, 240, 320, 540, 720, 680, 520, 360, 220
];

export const Hourly: Story = {
  render: () => (
    <div className="p-md max-w-2xl">
      <RevenueStatsGrid
        values={HOURLY_VALUES}
        bucketLabels={HOURLY_LABELS}
        labels={{
          total: "Total",
          average: "Avg / hour",
          peak: "Peak hour",
          low: "Lowest hour"
        }}
        formatValue={formatRevenue}
      />
    </div>
  )
};

export const Empty: Story = {
  render: () => (
    <div className="p-md max-w-2xl">
      <RevenueStatsGrid
        values={[]}
        bucketLabels={[]}
        labels={{
          total: "Total",
          average: "Avg / hour",
          peak: "Peak hour",
          low: "Lowest hour"
        }}
        formatValue={formatRevenue}
      />
    </div>
  )
};
