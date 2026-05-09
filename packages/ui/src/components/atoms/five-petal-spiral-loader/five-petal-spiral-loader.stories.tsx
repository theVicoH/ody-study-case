import { FivePetalSpiralLoader } from "./five-petal-spiral-loader.atom";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FivePetalSpiralLoader> = {
  title: "Components/Atoms/FivePetalSpiralLoader",
  component: FivePetalSpiralLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;

type Story = StoryObj<typeof FivePetalSpiralLoader>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 48 }
};

export const Large: Story = {
  args: { size: 192 }
};

export const OnCard: Story = {
  render: () => (
    <div className="bg-foreground/5 flex size-48 items-center justify-center rounded-xl">
      <FivePetalSpiralLoader size={80} />
    </div>
  )
};
