import { SparklineChart } from "./sparkline-chart.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SparklineChart> = {
  title: "Components/Molecules/SparklineChart",
  component: SparklineChart,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof SparklineChart>;

const sampleData = [42, 58, 45, 70, 55, 80, 65, 90, 75, 88, 60, 95, 72, 85, 68, 92, 78, 65, 82, 70, 88, 76, 91, 84];

export const Default: Story = {
  args: {
    data: sampleData,
    height: 80
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};

export const Tall: Story = {
  args: {
    data: sampleData,
    height: 120
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};

export const Flat: Story = {
  args: {
    data: [50, 50, 50, 50, 50, 50, 50, 50],
    height: 80
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};
