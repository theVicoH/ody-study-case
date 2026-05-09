import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Primitives/Tabs",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground pt-2 text-sm">Account settings content.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground pt-2 text-sm">Password settings content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-muted-foreground pt-2 text-sm">General settings content.</p>
      </TabsContent>
    </Tabs>
  )
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Analytics</TabsTrigger>
        <TabsTrigger value="tab3">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-muted-foreground pt-2 text-sm">Overview content.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-muted-foreground pt-2 text-sm">Analytics content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-muted-foreground pt-2 text-sm">Reports content.</p>
      </TabsContent>
    </Tabs>
  )
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="vertical" className="flex gap-4">
      <TabsList>
        <TabsTrigger value="tab1">Profile</TabsTrigger>
        <TabsTrigger value="tab2">Billing</TabsTrigger>
        <TabsTrigger value="tab3">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-muted-foreground text-sm">Profile content.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-muted-foreground text-sm">Billing content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-muted-foreground text-sm">Notifications content.</p>
      </TabsContent>
    </Tabs>
  )
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="tab3">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-muted-foreground pt-2 text-sm">Active tab content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-muted-foreground pt-2 text-sm">Another tab content.</p>
      </TabsContent>
    </Tabs>
  )
};
