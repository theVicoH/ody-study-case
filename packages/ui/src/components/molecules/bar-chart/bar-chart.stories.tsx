import { BarChart } from "./bar-chart.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BarChart> = {
  title: "Components/Molecules/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    values: [4200, 5800, 4500, 7000, 5500, 8000, 6500],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};

export const Uniform: Story = {
  args: {
    values: [5000, 5000, 5000, 5000, 5000, 5000, 5000],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};
