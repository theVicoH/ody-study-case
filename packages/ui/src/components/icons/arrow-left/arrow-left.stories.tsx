import { ArrowLeftIcon } from "./arrow-left.icon";

import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof ArrowLeftIcon> = {
  title: "Icons/ArrowLeft",
  component: ArrowLeftIcon,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof ArrowLeftIcon>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 40 }
};
