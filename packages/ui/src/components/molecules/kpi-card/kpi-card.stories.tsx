import { KpiCard } from "./kpi-card.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KpiCard> = {
  title: "Components/Molecules/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "subtle"] },
    trendDirection: { control: "select", options: ["up", "down"] }
  }
};

export default meta;

type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    label: "Couverts",
    value: 142,
    trend: "+8%",
    trendDirection: "up"
  }
};

export const Down: Story = {
  args: {
    label: "Commandes",
    value: 38,
    trend: "-4%",
    trendDirection: "down"
  }
};

export const NoTrend: Story = {
  args: {
    label: "Restaurants",
    value: 5
  }
};

export const Subtle: Story = {
  parameters: {
    backgrounds: { default: "dark" }
  },
  render: () => (
    <div className="grid grid-cols-2 gap-2.5 p-4" style={{ background: "#0a0612" }}>
      <KpiCard label="Restaurants" value={5} variant="subtle" />
      <KpiCard label="Performants" value={3} trend="+12%" trendDirection="up" variant="subtle" />
      <KpiCard label="Couverts" value={142} trend="+8%" trendDirection="up" variant="subtle" />
      <KpiCard label="Revenu" value="€8 420" variant="subtle" />
      <KpiCard label="Commandes" value={38} trend="-4%" trendDirection="down" variant="subtle" />
      <KpiCard label="Note moyenne" value="★ 4.6" variant="subtle" />
    </div>
  )
};
