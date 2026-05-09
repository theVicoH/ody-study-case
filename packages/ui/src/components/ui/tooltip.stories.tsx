import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-16">
          <Story />
        </div>
      </TooltipProvider>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  )
};

export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Top</Button>} />
      <TooltipContent side="top">Appears on top</TooltipContent>
    </Tooltip>
  )
};

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Bottom</Button>} />
      <TooltipContent side="bottom">Appears on bottom</TooltipContent>
    </Tooltip>
  )
};

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Left</Button>} />
      <TooltipContent side="left">Appears on left</TooltipContent>
    </Tooltip>
  )
};

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Right</Button>} />
      <TooltipContent side="right">Appears on right</TooltipContent>
    </Tooltip>
  )
};
