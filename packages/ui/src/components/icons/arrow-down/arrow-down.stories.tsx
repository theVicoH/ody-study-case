import React, { useRef } from "react";

import { ArrowDownIcon } from "./arrow-down.icon";

import type { ArrowDownIconHandle } from "./arrow-down.icon";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const CONTROLLED_SIZE = 40;

const meta: Meta<typeof ArrowDownIcon> = {
  title: "Foundations/Icons/ArrowDownIcon",
  component: ArrowDownIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "range", min: 16, max: 96, step: 4 } },
    duration: { control: { type: "range", min: 0.2, max: 3, step: 0.1 } },
    isAnimated: { control: "boolean" },
    color: { control: "color" }
  }
};

export default meta;

type Story = StoryObj<typeof ArrowDownIcon>;

export const Default: Story = {};

export const Small: Story = { args: { size: 16 } };

export const Large: Story = { args: { size: 64 } };

export const CustomColor: Story = { args: { color: "hsl(var(--primary))", size: 32 } };

export const SlowAnimation: Story = { args: { duration: 3, size: 32 } };

export const NoAnimation: Story = { args: { isAnimated: false, size: 32 } };

const ControlledRender = (): React.JSX.Element => {
  const ref = useRef<ArrowDownIconHandle>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <ArrowDownIcon ref={ref} size={CONTROLLED_SIZE} />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => ref.current?.startAnimation()}>
          Start
        </Button>
        <Button size="sm" variant="outline" onClick={() => ref.current?.stopAnimation()}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export const Controlled: Story = { render: () => <ControlledRender /> };
