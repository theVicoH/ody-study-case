import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PopoverContent> = {
  title: "Components/Primitives/Popover",
  component: PopoverContent,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof PopoverContent>;

export const Default: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent {...args}>
        <p>Popover content goes here.</p>
      </PopoverContent>
    </Popover>
  )
};
