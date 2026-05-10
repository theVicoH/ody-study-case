import React, { useRef } from "react";

import { CalendarIcon } from "./calendar.icon";

import { Button } from "@/components/ui/button";

import type { CalendarIconHandle } from "./calendar.icon";
import type { Meta, StoryObj } from "@storybook/react";

const CONTROLLED_SIZE = 40;

const meta: Meta<typeof CalendarIcon> = {
  title: "Foundations/Icons/CalendarIcon",
  component: CalendarIcon,
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

type Story = StoryObj<typeof CalendarIcon>;

export const Default: Story = {};

export const Small: Story = { args: { size: 16 } };

export const Large: Story = { args: { size: 64 } };

const ControlledRender = (): React.JSX.Element => {
  const ref = useRef<CalendarIconHandle>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <CalendarIcon ref={ref} size={CONTROLLED_SIZE} />
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
