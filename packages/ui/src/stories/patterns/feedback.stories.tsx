import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


const meta: Meta = {
  title: "Patterns/Feedback",
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj;

export const EmptyStates: Story = {
  render: () => (
    <div className="gap-xl flex w-full max-w-[36rem] flex-col">
      <div className="border-border bg-card p-xl gap-sm flex flex-col items-center rounded-xl border text-center">
        <span className="text-4xl">🍽️</span>
        <h3 className="typo-h4 text-foreground">No orders yet</h3>
        <p className="typo-body-sm text-muted-foreground max-w-[20rem]">Once customers place orders, they'll appear here. Share your menu link to get started.</p>
        <Button className="mt-sm">Share menu</Button>
      </div>

      <div className="border-border bg-card p-xl gap-sm flex flex-col items-center rounded-xl border text-center">
        <span className="text-4xl">👥</span>
        <h3 className="typo-h4 text-foreground">No customers found</h3>
        <p className="typo-body-sm text-muted-foreground max-w-[20rem]">Try adjusting your search filters, or add your first customer manually.</p>
        <div className="gap-sm mt-sm flex">
          <Button variant="outline">Clear filters</Button>
          <Button>Add customer</Button>
        </div>
      </div>
    </div>
  )
};

export const LoadingSkeletons: Story = {
  render: () => (
    <div className="gap-md flex w-full max-w-[36rem] flex-col">
      <div className="border-border bg-card p-lg gap-md flex flex-col rounded-xl border">
        <div className="gap-md flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="gap-xs flex flex-1 flex-col">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="gap-sm flex flex-col">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="gap-sm flex">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <div className="gap-md grid grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-border bg-card p-md gap-sm flex flex-col rounded-xl border">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
};

export const StatusBadges: Story = {
  render: () => (
    <div className="gap-lg flex w-full max-w-[28rem] flex-col">
      <div className="gap-sm flex flex-col">
        <span className="typo-overline text-muted-foreground">Order status</span>
        <div className="gap-sm flex flex-wrap">
          <Badge variant="default">New</Badge>
          <Badge variant="secondary">In preparation</Badge>
          <Badge variant="outline">Ready</Badge>
          <Badge variant="destructive">Cancelled</Badge>
        </div>
      </div>
      <div className="gap-sm flex flex-col">
        <span className="typo-overline text-muted-foreground">Table status</span>
        <div className="gap-sm flex flex-wrap">
          <Badge>Available</Badge>
          <Badge variant="secondary">Reserved</Badge>
          <Badge variant="outline">Occupied</Badge>
        </div>
      </div>
    </div>
  )
};

export const Default: Story = EmptyStates;
