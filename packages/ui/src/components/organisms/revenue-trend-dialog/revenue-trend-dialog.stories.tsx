import { useState } from "react";

import { RevenueTrendDialog } from "./revenue-trend-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof RevenueTrendDialog> = {
  title: "Components/Organisms/RevenueTrendDialog",
  component: RevenueTrendDialog,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RevenueTrendDialog>;

const REVENUE_THOUSAND = 1000;

const formatRevenue = (value: number): string =>
  value >= REVENUE_THOUSAND ? `€${(value / REVENUE_THOUSAND).toFixed(1)}k` : `€${Math.round(value)}`;

const labels = {
  title: "Revenue trend — hourly",
  description: "Hour-by-hour revenue for the selected day.",
  total: "Total",
  peakHour: "Peak hour",
  lowHour: "Lowest hour",
  avgHourly: "Avg / hour",
  vsPrior: "vs prior",
  timelineTitle: "Last 24h"
};

const HOURLY_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}h`);

const TODAY_DATA = [120, 95, 80, 60, 55, 45, 70, 110, 180, 240, 320, 480, 620, 540, 360, 280, 240, 320, 540, 720, 680, 520, 360, 220];

const RevenueTrendDialogDemo = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open revenue trend</Button>
      <RevenueTrendDialog
        open={open}
        onOpenChange={setOpen}
        labels={labels}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        maxDate={today}
        hourlyValues={TODAY_DATA}
        hourlyLabels={HOURLY_LABELS}
        formatRevenue={formatRevenue}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <RevenueTrendDialogDemo />
};

const RevenueTrendDialogOpenByDefault = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <RevenueTrendDialog
      open={open}
      onOpenChange={setOpen}
      labels={labels}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      maxDate={today}
      hourlyValues={TODAY_DATA}
      hourlyLabels={HOURLY_LABELS}
      formatRevenue={formatRevenue}
    />
  );
};

export const OpenByDefault: Story = {
  render: () => <RevenueTrendDialogOpenByDefault />
};

const RevenueTrendDialogEmpty = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <RevenueTrendDialog
      open={open}
      onOpenChange={setOpen}
      labels={labels}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      maxDate={today}
      hourlyValues={[]}
      hourlyLabels={[]}
      formatRevenue={formatRevenue}
    />
  );
};

export const Empty: Story = {
  render: () => <RevenueTrendDialogEmpty />
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load revenue trend. Please try again.
    </div>
  )
};
