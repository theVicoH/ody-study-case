import { Calendar } from "./calendar";

import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: { mode: "single" }
};

export const Range: Story = {
  args: { mode: "range" }
};

export const Multiple: Story = {
  args: { mode: "multiple" }
};
