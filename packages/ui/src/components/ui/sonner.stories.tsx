import { toast } from "sonner";

import { Button } from "./button";
import { Toaster } from "./sonner";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Primitives/Sonner",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast("Event has been created")}>
      Show toast
    </Button>
  )
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("Changes saved successfully")}>
      Success toast
    </Button>
  )
};

export const Error: Story = {
  render: () => (
    <Button variant="destructive" onClick={() => toast.error("Something went wrong")}>
      Error toast
    </Button>
  )
};

export const Warning: Story = {
  render: () => (
    <Button variant="secondary" onClick={() => toast.warning("Please review your changes")}>
      Warning toast
    </Button>
  )
};

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.info("New update available")}>
      Info toast
    </Button>
  )
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Default message")}>Default</Button>
      <Button onClick={() => toast.success("Success!")}>Success</Button>
      <Button variant="destructive" onClick={() => toast.error("Error!")}>Error</Button>
      <Button variant="secondary" onClick={() => toast.warning("Warning!")}>Warning</Button>
      <Button variant="ghost" onClick={() => toast.info("Info!")}>Info</Button>
    </div>
  )
};
