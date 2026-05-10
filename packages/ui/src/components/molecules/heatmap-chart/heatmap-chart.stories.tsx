import { HeatmapChart } from "./heatmap-chart.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HeatmapChart> = {
  title: "Components/Molecules/HeatmapChart",
  component: HeatmapChart,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof HeatmapChart>;

const sampleData = [
  [0.1, 0.2, 0.15, 0.3, 0.25, 0.4, 0.35],
  [0.3, 0.5, 0.4, 0.6, 0.55, 0.75, 0.7],
  [0.6, 0.8, 0.7, 0.9, 0.85, 1.0, 0.95],
  [0.7, 0.85, 0.75, 0.95, 0.9, 0.8, 0.75],
  [0.4, 0.55, 0.5, 0.65, 0.6, 0.5, 0.45],
  [0.2, 0.3, 0.25, 0.35, 0.3, 0.25, 0.2]
];

export const Default: Story = {
  args: {
    data: sampleData,
    hourLabels: ["12h", "13h", "14h", "19h", "20h", "21h"],
    dayLabels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4" style={{ background: "#0a0612" }}>
        <Story />
      </div>
    )
  ]
};
