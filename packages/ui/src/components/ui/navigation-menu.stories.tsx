import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "./navigation-menu";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/NavigationMenu",
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    (Story) => (
      <div className="flex h-64 justify-center pt-8">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex w-48 flex-col gap-1 p-2">
              <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
              <NavigationMenuLink href="#">Dashboard</NavigationMenuLink>
              <NavigationMenuLink href="#">Reports</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex w-48 flex-col gap-1 p-2">
              <NavigationMenuLink href="#">About us</NavigationMenuLink>
              <NavigationMenuLink href="#">Blog</NavigationMenuLink>
              <NavigationMenuLink href="#">Careers</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="hover:bg-muted h-9 rounded-lg px-2.5 py-1.5 text-sm font-medium">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
};

export const SimpleLinks: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="hover:bg-muted h-9 rounded-lg px-2.5 py-1.5 text-sm font-medium">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="hover:bg-muted h-9 rounded-lg px-2.5 py-1.5 text-sm font-medium">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="hover:bg-muted h-9 rounded-lg px-2.5 py-1.5 text-sm font-medium" data-active>
            Components
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
};
