import { PerfSummaryCell } from "./perf-summary-cell.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PerfSummaryCell> = {
  title: "Components/Molecules/PerfSummaryCell",
  component: PerfSummaryCell,
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: ["good", "warn", "bad"] }
  }
};

export default meta;

type Story = StoryObj<typeof PerfSummaryCell>;

export const Good: Story = {
  args: { value: 12, label: "Performing", tone: "good" }
};

export const Warn: Story = {
  args: { value: 4, label: "To watch", tone: "warn" }
};

export const Bad: Story = {
  args: { value: 1, label: "Alert", tone: "bad" }
};

export const Grid: Story = {
  render: () => (
    <div className="grid w-96 grid-cols-3 gap-2.5">
      <PerfSummaryCell value={12} label="Performing" tone="good" />
      <PerfSummaryCell value={4} label="To watch" tone="warn" />
      <PerfSummaryCell value={1} label="Alert" tone="bad" />
    </div>
  )
};
