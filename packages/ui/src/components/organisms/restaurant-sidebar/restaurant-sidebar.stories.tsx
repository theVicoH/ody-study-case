import { RestaurantSidebar } from "./restaurant-sidebar.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { ChartLineIcon } from "@/components/icons/chart-line/chart-line.icon";
import { HouseIcon } from "@/components/icons/home/home.icon";
import { SettingsIcon } from "@/components/icons/settings/settings.icon";



const meta: Meta<typeof RestaurantSidebar> = {
  title: "Components/Organisms/RestaurantSidebar",
  component: RestaurantSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof RestaurantSidebar>;

const navItems = [
  { id: "home", label: "Overview", icon: HouseIcon },
  { id: "stats", label: "Statistics", icon: ChartLineIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon }
];

const restaurants = [
  { id: "r1", name: "Bistro Saint-Roch", caption: "12 rue Saint-Roch", status: "good" as const },
  { id: "r2", name: "Le Marais", caption: "8 rue de Rivoli", status: "warn" as const },
  { id: "r3", name: "Café Nord", caption: "22 boulevard Hugo", status: "bad" as const }
];

const defaultArgs = {
  open: true,
  miniSlot: <div className="bg-foreground/10 size-full" />,
  miniName: "Bistro Saint-Roch",
  miniStatus: "good" as const,
  miniCaption: "Performing well",
  navItems,
  activeTabId: "home",
  onTabChange: (): void => undefined,
  groupLabel: "All restaurants",
  groupOverview: "Group overview",
  isGroupActive: false,
  onSelectGroup: (): void => undefined,
  restaurants,
  activeRestaurantId: "r1",
  onSelectRestaurant: (): void => undefined
};

const sidebarDecorators = [
  (Story: () => React.JSX.Element): React.JSX.Element => {
    return (
      <div className="bg-background relative h-screen w-screen">
        <Story />
      </div>
    );
  }
];

export const Default: Story = {
  args: defaultArgs,
  decorators: sidebarDecorators
};

export const Empty: Story = {
  args: {
    ...defaultArgs,
    restaurants: [],
    activeRestaurantId: null
  },
  decorators: sidebarDecorators
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load restaurants. Please try again.
    </div>
  )
};
