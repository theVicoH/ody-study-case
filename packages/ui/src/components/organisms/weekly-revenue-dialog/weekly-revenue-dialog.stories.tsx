import { useState } from "react";

import { WeeklyRevenueDialog } from "./weekly-revenue-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof WeeklyRevenueDialog> = {
  title: "Components/Organisms/WeeklyRevenueDialog",
  component: WeeklyRevenueDialog,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof WeeklyRevenueDialog>;

const REVENUE_THOUSAND = 1000;

const formatRevenue = (value: number): string =>
  value >= REVENUE_THOUSAND ? `€${(value / REVENUE_THOUSAND).toFixed(1)}k` : `€${Math.round(value)}`;

const labels = {
  title: "Weekly revenue",
  description: "Day-by-day revenue for the selected week.",
  total: "Total",
  average: "Average",
  peak: "Peak",
  best: "Best",
  worst: "Worst",
  growth: "Growth",
  weeklyTitle: "Last 7 days"
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const THIS_WEEK_DATA = [3800, 4200, 3900, 5100, 4700, 6200, 5600];

const WeeklyRevenueDialogDemo = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open weekly revenue</Button>
      <WeeklyRevenueDialog
        open={open}
        onOpenChange={setOpen}
        labels={labels}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        maxDate={today}
        weeklyValues={THIS_WEEK_DATA}
        weeklyLabels={DAY_LABELS}
        formatRevenue={formatRevenue}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <WeeklyRevenueDialogDemo />
};
