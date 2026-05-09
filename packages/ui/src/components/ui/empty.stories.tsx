import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "./empty";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Primitives/Empty",
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    (Story) => (
      <div className="mx-auto mt-8 flex h-64 w-full max-w-[28rem] items-center justify-center rounded-xl border border-dashed">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
};

export const WithAction: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No items yet</EmptyTitle>
        <EmptyDescription>Get started by creating your first item.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create item</Button>
      </EmptyContent>
    </Empty>
  )
};

export const WithIcon: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>Your inbox is empty.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
};
