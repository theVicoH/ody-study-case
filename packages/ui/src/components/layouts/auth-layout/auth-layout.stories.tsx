import React from "react";

import { AuthLayout } from "@/components/layouts/auth-layout/auth-layout.layout";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AuthLayout> = {
  title: "Components/Layouts/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" }
};

export default meta;

type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  render: () => (
    <AuthLayout>
      <div className="text-foreground typo-body-sm">Auth content goes here.</div>
    </AuthLayout>
  )
};
