import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./sheet";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Sheet",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;

type Story = StoryObj;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open right</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description goes here.</SheetDescription>
        </SheetHeader>
        <p className="text-muted-foreground px-4 text-sm">Sheet body content.</p>
        <SheetFooter>
          <Button size="sm">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open left</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Left sheet</SheetTitle>
          <SheetDescription>Slides in from the left.</SheetDescription>
        </SheetHeader>
        <p className="text-muted-foreground px-4 text-sm">Navigation or settings content.</p>
      </SheetContent>
    </Sheet>
  )
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open top</Button>} />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Top sheet</SheetTitle>
          <SheetDescription>Slides down from the top.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open bottom</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom sheet</SheetTitle>
          <SheetDescription>Slides up from the bottom.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
};
