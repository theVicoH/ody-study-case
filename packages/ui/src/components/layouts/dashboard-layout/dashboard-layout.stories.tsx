import { BrandMark } from "@workspace/ui/components/atoms/brand-mark/brand-mark.atom";

import { DashboardLayout } from "./dashboard-layout.layout";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DashboardLayout> = {
  title: "Components/Layouts/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    brand: <BrandMark size="md" label="Soldout" />,
    brandVisible: true,
    headerActions: (
      <div className="bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm">
        Actions
      </div>
    ),
    background: (
      <div className="bg-muted/30 absolute inset-0 flex items-center justify-center">
        Background slot
      </div>
    ),
    footer: (
      <div className="bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm">
        Footer
      </div>
    ),
    children: null
  }
};

export const WithoutBrand: Story = {
  args: {
    ...Default.args,
    brandVisible: false
  }
};

export const BackgroundDimmed: Story = {
  args: {
    ...Default.args,
    backgroundDimmed: true
  }
};
