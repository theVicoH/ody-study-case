import { Label } from "./label";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Label> = {
  title: "Components/Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" }
  }
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Email address" }
};

export const WithHtmlFor: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <input id="email" type="email" className="border-input rounded-sm border px-2 py-1 text-sm" />
    </div>
  )
};

export const Disabled: Story = {
  render: () => (
    <div data-disabled="true" className="group flex flex-col gap-2">
      <Label>Disabled label</Label>
    </div>
  )
};
