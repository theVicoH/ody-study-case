import React from "react";

import { RegisterForm } from "@/components/organisms/register-form/register-form.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RegisterForm> = {
  title: "Organisms/RegisterForm",
  component: RegisterForm,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof RegisterForm>;

const noop = (): void => undefined;

export const Default: Story = {
  args: { isLoading: false, error: null, onSubmit: noop, onSwitchToLogin: noop },
  render: (args) => (
    <div className="bg-card/60 border-border/60 w-80 rounded-3xl border p-7 shadow-xl backdrop-blur-xl">
      <RegisterForm {...args} />
    </div>
  )
};

export const Loading: Story = {
  args: { isLoading: true, error: null, onSubmit: noop, onSwitchToLogin: noop },
  render: Default.render
};

export const WithError: Story = {
  args: { isLoading: false, error: "emailAlreadyExists", onSubmit: noop, onSwitchToLogin: noop },
  render: Default.render
};
