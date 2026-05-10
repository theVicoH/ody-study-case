import { useState } from "react";

import { AffluenceDialog } from "./affluence-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof AffluenceDialog> = {
  title: "Components/Organisms/AffluenceDialog",
  component: AffluenceDialog,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof AffluenceDialog>;

const labels = {
  title: "Affluence",
  description: "Hours × days fill rate for the selected week.",
  fillRate: "Avg fill rate",
  peakSlot: "Peak slot",
  quietSlot: "Quietest slot",
  heatmapTitle: "Hours × days"
};

const HOURS = ["12h", "13h", "14h", "19h", "20h", "21h"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const THIS_WEEK_DATA = [
  [0.1, 0.2, 0.15, 0.3, 0.25, 0.4, 0.35],
  [0.3, 0.5, 0.4, 0.6, 0.55, 0.75, 0.7],
  [0.6, 0.8, 0.7, 0.9, 0.85, 1.0, 0.95],
  [0.7, 0.85, 0.75, 0.95, 0.9, 0.8, 0.75],
  [0.4, 0.55, 0.5, 0.65, 0.6, 0.5, 0.45],
  [0.2, 0.3, 0.25, 0.35, 0.3, 0.25, 0.2]
];

const AffluenceDialogDemo = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open affluence</Button>
      <AffluenceDialog
        open={open}
        onOpenChange={setOpen}
        labels={labels}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        maxDate={today}
        data={THIS_WEEK_DATA}
        hourLabels={HOURS}
        dayLabels={DAYS}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <AffluenceDialogDemo />
};

const AffluenceDialogOpenByDefault = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <AffluenceDialog
      open={open}
      onOpenChange={setOpen}
      labels={labels}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      maxDate={today}
      data={THIS_WEEK_DATA}
      hourLabels={HOURS}
      dayLabels={DAYS}
    />
  );
};

export const OpenByDefault: Story = {
  render: () => <AffluenceDialogOpenByDefault />
};

const AffluenceDialogEmpty = (): React.JSX.Element => {
  const today = new Date();
  const [open, setOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <AffluenceDialog
      open={open}
      onOpenChange={setOpen}
      labels={labels}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      maxDate={today}
      data={[]}
      hourLabels={[]}
      dayLabels={[]}
    />
  );
};

export const Empty: Story = {
  render: () => <AffluenceDialogEmpty />
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load affluence data. Please try again.
    </div>
  )
};
