import { BrandMark } from "./brand-mark.atom";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BrandMark> = {
  title: "Components/Atoms/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] }
  }
};

export default meta;

type Story = StoryObj<typeof BrandMark>;

export const Default: Story = {
  args: { size: "md", label: "ODY" }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <BrandMark size="sm" />
      <BrandMark size="md" />
      <BrandMark size="lg" />
    </div>
  )
};
