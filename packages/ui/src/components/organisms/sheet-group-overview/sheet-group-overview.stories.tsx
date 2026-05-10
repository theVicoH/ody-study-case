import { SheetGroupOverview } from "./sheet-group-overview.organism";

import type { Meta, StoryObj } from "@storybook/react";

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
