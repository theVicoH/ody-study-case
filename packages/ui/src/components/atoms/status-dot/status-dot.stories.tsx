import { StatusDot } from "./status-dot.atom";

import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof StatusDot> = {
  title: "Components/Atoms/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["good", "warn", "bad"]
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof StatusDot>;

export const Good: Story = {
  args: { status: "good" }
};

export const Warn: Story = {
  args: { status: "warn" }
};

export const Bad: Story = {
  args: { status: "bad" }
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="good" />
        <span>Performe bien</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="warn" />
        <span>À surveiller</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="bad" />
        <span>Sous-performe</span>
      </div>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusDot status="good" size="sm" />
      <StatusDot status="good" size="md" />
      <StatusDot status="good" size="lg" />
    </div>
  )
};

export const WithBadge: Story = {
  render: () => (
    <Badge variant="tertiary" className="h-7 gap-1.5 px-3 text-sm">
      <StatusDot status="good" size="sm" />
      Bistro Saint-Roch
    </Badge>
  )
};
