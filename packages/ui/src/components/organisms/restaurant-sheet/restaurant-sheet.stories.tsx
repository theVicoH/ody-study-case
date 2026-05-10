import { RestaurantSheet } from "./restaurant-sheet.organism";

import type { Meta, StoryObj } from "@storybook/react";

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

export const Default: Story = {
  args: {
    open: true,
    status: "good",
    eyebrow: "Group view",
    title: "All restaurants",
    caption: "5 active establishments",
    closeLabel: "Close",
    expandLabel: "Expand",
    collapseLabel: "Collapse",
    moveLabel: "Move sheet",
    resizeLabel: "Resize sheet",
    onClose: () => undefined,
    onToggleExpand: () => undefined,
    children: <p className="text-muted-foreground">Sheet body content</p>
  },
  decorators: [
    (Story) => (
      <div className="bg-background relative h-screen w-screen">
        <Story />
      </div>
    )
  ]
};
