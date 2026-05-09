import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./card";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div style={{ width: "380px" }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Card content area.</p>
      </CardContent>
    </Card>
  )
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with footer</CardTitle>
        <CardDescription>This card has a footer section.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Content area.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  )
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with action</CardTitle>
        <CardDescription>Header action aligned to the right.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Content area.</p>
      </CardContent>
    </Card>
  )
};

export const Small: Story = {
  render: () => (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Small card</CardTitle>
        <CardDescription>Compact size variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Smaller padding and text.</p>
      </CardContent>
    </Card>
  )
};

export const Warning: Story = {
  render: () => (
    <Card variant="warning">
      <CardHeader>
        <CardTitle>Warning</CardTitle>
        <CardDescription>Your session expires in 5 minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm opacity-80">Save your work before it&apos;s too late.</p>
      </CardContent>
    </Card>
  )
};

export const Error: Story = {
  render: () => (
    <Card variant="error">
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>Failed to save your changes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm opacity-80">An unexpected error occurred. Please try again.</p>
      </CardContent>
    </Card>
  )
};

export const Info: Story = {
  render: () => (
    <Card variant="info">
      <CardHeader>
        <CardTitle>Info</CardTitle>
        <CardDescription>A new version is available.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm opacity-80">Refresh the page to get the latest features.</p>
      </CardContent>
    </Card>
  )
};

export const GlassmorphismVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card variant="info">
        <CardHeader>
          <CardTitle>Info</CardTitle>
          <CardDescription>Informational glassmorphism.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="warning">
        <CardHeader>
          <CardTitle>Warning</CardTitle>
          <CardDescription>Warning glassmorphism.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="error">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Error glassmorphism.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
};
