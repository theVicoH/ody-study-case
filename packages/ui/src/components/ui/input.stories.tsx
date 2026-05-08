import { Input } from "./input";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "url", "tel"]
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" }
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." }
};

export const Email: Story = {
  args: { type: "email", placeholder: "Enter email..." }
};

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password..." }
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true }
};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" }
};
