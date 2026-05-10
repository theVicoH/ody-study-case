import { SidebarNav } from "./sidebar-nav.molecule";

import type { Meta, StoryObj } from "@storybook/react";

import { BookmarkCheckIcon } from "@/components/icons/bookmark-check/bookmark-check.icon";
import { ChartLineIcon } from "@/components/icons/chart-line/chart-line.icon";
import { HouseIcon } from "@/components/icons/home/home.icon";
import { SettingsIcon } from "@/components/icons/settings/settings.icon";
import { UsersIcon } from "@/components/icons/users/users.icon";



const meta: Meta<typeof SidebarNav> = {
  title: "Components/Molecules/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;

type Story = StoryObj<typeof SidebarNav>;

const items = [
  { id: "home", label: "Overview", icon: HouseIcon },
  { id: "stats", label: "Statistics", icon: ChartLineIcon },
  { id: "reservations", label: "Reservations", icon: BookmarkCheckIcon },
  { id: "team", label: "Team", icon: UsersIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon }
];

export const Default: Story = {
  args: {
    items,
    activeId: "home",
    onSelect: () => undefined
  }
};

export const StatsActive: Story = {
  args: {
    items,
    activeId: "stats",
    onSelect: () => undefined
  }
};

export const SettingsActive: Story = {
  args: {
    items,
    activeId: "settings",
    onSelect: () => undefined
  }
};

export const WithSplitAffordance: Story = {
  args: {
    items,
    activeId: "home",
    secondaryActiveId: "reservations",
    splitLabel: "Open beside",
    onSelect: () => undefined,
    onSplit: () => undefined
  }
};
