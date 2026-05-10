import { useState } from "react";

import { Calendar } from "./calendar";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Primitives/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" }
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;

const CalendarDemo = (): React.JSX.Element => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="border-border bg-card inline-block rounded-lg border">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    </div>
  );
};

export const Single: Story = {
  render: () => <CalendarDemo />
};
