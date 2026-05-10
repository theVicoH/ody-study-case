import { Switch } from "./switch";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Switch> = {
  title: "Components/Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default"]
    },
    disabled: { control: "boolean" }
  }
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { size: "default" }
};

export const Small: Story = {
  args: { size: "sm" }
};

export const Checked: Story = {
  args: { defaultChecked: true }
};

export const Disabled: Story = {
  args: { disabled: true }
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true }
};
