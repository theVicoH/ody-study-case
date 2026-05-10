import { SunLabel } from "./sun-label.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SunLabel> = {
  title: "Components/Molecules/SunLabel",
  component: SunLabel,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof SunLabel>;

export const Default: Story = {
  args: {
    brand: "ODY",
    cta: "Click to explore"
  }
};

export const French: Story = {
  args: {
    brand: "ODY",
    cta: "Cliquer pour explorer"
  }
};
