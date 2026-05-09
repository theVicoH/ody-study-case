import { Separator } from "./separator";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Separator> = {
  title: "Components/Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"]
    }
  }
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  decorators: [
    (Story) => (
      <div className="w-64 py-4">
        <Story />
      </div>
    )
  ]
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [
    (Story) => (
      <div className="flex h-12 items-center gap-4 px-4">
        <span className="text-sm">Left</span>
        <Story />
        <span className="text-sm">Right</span>
      </div>
    )
  ]
};

export const WithContent: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <p className="text-sm">Above the separator</p>
      <Separator />
      <p className="text-muted-foreground text-sm">Below the separator</p>
    </div>
  )
};
