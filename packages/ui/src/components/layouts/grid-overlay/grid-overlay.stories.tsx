import { GridOverlay } from "./grid-overlay.layout";

import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof GridOverlay> = {
  title: "Components/Layouts/GridOverlay",
  component: GridOverlay,
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof GridOverlay>;

export const Visible: Story = {
  args: { visible: true }
};

export const Hidden: Story = {
  args: { visible: false }
};
