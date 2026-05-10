import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "./sidebar";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Primitives/Sidebar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj;

const navItems = [
  { label: "Dashboard", href: "#" },
  { label: "Analytics", href: "#" },
  { label: "Reports", href: "#" },
  { label: "Settings", href: "#" }
];

export const Default: Story = {
  render: () => (
    <SidebarProvider style={{ minHeight: "400px" }}>
      <Sidebar>
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-medium">My App</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton render={<a href={item.href}>{item.label}</a>} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-muted-foreground px-2 py-1 text-xs">v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-muted-foreground text-sm">Main content area</span>
        </div>
      </main>
    </SidebarProvider>
  )
};

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false} style={{ minHeight: "400px" }}>
      <Sidebar>
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-medium">My App</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton render={<a href={item.href}>{item.label}</a>} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-muted-foreground text-sm">Sidebar starts collapsed</span>
        </div>
      </main>
    </SidebarProvider>
  )
};
