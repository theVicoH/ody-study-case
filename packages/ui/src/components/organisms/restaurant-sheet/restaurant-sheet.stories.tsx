import { RestaurantSheet } from "./restaurant-sheet.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof RestaurantSheet> = {
  title: "Components/Organisms/RestaurantSheet",
  component: RestaurantSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantSheet>;

const defaultArgs = {
  open: true,
  status: "good" as const,
  eyebrow: "Group view",
  title: "All restaurants",
  caption: "5 active establishments",
  closeLabel: "Close",
  expandLabel: "Expand",
  collapseLabel: "Collapse",
  moveLabel: "Move sheet",
  resizeLabel: "Resize sheet",
  onClose: (): void => undefined,
  onToggleExpand: (): void => undefined
};

const sheetDecorators = [
  (Story: () => React.JSX.Element): React.JSX.Element => {
    return (
      <div className="bg-background relative h-screen w-screen">
        <Story />
      </div>
    );
  }
];

export const Default: Story = {
  args: {
    ...defaultArgs,
    children: <p className="text-muted-foreground">Sheet body content</p>
  },
  decorators: sheetDecorators
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    title: "Loading",
    children: (
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  },
  decorators: sheetDecorators
};

export const Empty: Story = {
  args: {
    ...defaultArgs,
    children: <p className="text-muted-foreground p-4">No content available.</p>
  },
  decorators: sheetDecorators
};

export const Error: Story = {
  args: {
    ...defaultArgs,
    children: (
      <div className="border-destructive bg-destructive/10 text-destructive m-4 rounded-md border p-4">
        Failed to load sheet content. Please try again.
      </div>
    )
  },
  decorators: sheetDecorators
};
