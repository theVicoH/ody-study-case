import { SheetTabBar } from "./sheet-tab-bar.molecule";

import type { Meta, StoryObj } from "@storybook/react";

import { ChartLineIcon } from "@/components/icons/chart-line/chart-line.icon";
import { HouseIcon } from "@/components/icons/home/home.icon";
import { SettingsIcon } from "@/components/icons/settings/settings.icon";



const meta: Meta<typeof SheetTabBar> = {
  title: "Components/Molecules/SheetTabBar",
  component: SheetTabBar,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetTabBar>;

const items = [
  { id: "home", label: "Overview", icon: HouseIcon },
  { id: "stats", label: "Statistics", icon: ChartLineIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon }
];

export const Default: Story = {
  args: {
    items,
    activeId: "home",
    onTabChange: () => undefined
  }
};
