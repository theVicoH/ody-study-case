import { SheetGroupOverview } from "./sheet-group-overview.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof SheetGroupOverview> = {
  title: "Components/Organisms/SheetGroupOverview",
  component: SheetGroupOverview,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetGroupOverview>;

export const Default: Story = {
  args: {
    total: 6,
    good: 4,
    warn: 1,
    bad: 1
  }
};

export const AllGood: Story = {
  args: {
    total: 6,
    good: 6,
    warn: 0,
    bad: 0
  }
};

export const Loading: Story = {
  render: () => (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
};

export const Empty: Story = {
  args: {
    total: 0,
    good: 0,
    warn: 0,
    bad: 0
  }
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load group overview. Please try again.
    </div>
  )
};
