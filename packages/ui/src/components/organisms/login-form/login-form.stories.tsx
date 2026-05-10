import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { LoginForm } from "@/components/organisms/login-form/login-form.organism";


const meta: Meta<typeof LoginForm> = {
  title: "Components/Organisms/LoginForm",
  component: LoginForm,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

const noop = (): void => undefined;

export const Default: Story = {
  args: { isLoading: false, error: null, onSubmit: noop, onSwitchToRegister: noop },
  render: (args) => (
    <div className="bg-card/60 border-border/60 w-80 rounded-3xl border p-7 shadow-xl backdrop-blur-xl">
      <LoginForm {...args} />
    </div>
  )
};

export const Loading: Story = {
  args: { isLoading: true, error: null, onSubmit: noop, onSwitchToRegister: noop },
  render: Default.render
};

export const WithError: Story = {
  args: { isLoading: false, error: "invalidCredentials", onSubmit: noop, onSwitchToRegister: noop },
  render: Default.render
};
