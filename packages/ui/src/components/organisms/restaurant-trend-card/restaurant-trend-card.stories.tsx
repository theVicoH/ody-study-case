import { RestaurantTrendCard } from "./restaurant-trend-card.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RestaurantTrendCard> = {
  title: "Components/Organisms/RestaurantTrendCard",
  component: RestaurantTrendCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantTrendCard>;

const SAMPLE = [120, 95, 80, 60, 55, 45, 70, 110, 180, 240, 320, 480, 620, 540, 360, 280, 240, 320, 540, 720, 680, 520, 360, 220];

export const Default: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantTrendCard
        labels={{ title: "Revenue trend", badge: "Last 24h" }}
        data={SAMPLE}
      />
    </div>
  )
};

export const Empty: Story = {
  render: () => (
    <div className="p-md max-w-md">
      <RestaurantTrendCard
        labels={{ title: "Revenue trend", badge: "Last 24h" }}
        data={[]}
      />
    </div>
  )
};
