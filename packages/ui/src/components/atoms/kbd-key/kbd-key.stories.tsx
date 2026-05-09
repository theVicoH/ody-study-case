import { KbdKey } from "./kbd-key.atom";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KbdKey> = {
  title: "Components/Atoms/KbdKey",
  component: KbdKey,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof KbdKey>;

export const Default: Story = {
  args: { children: "drag" }
};

export const Inline: Story = {
  render: () => (
    <p className="text-muted-foreground text-sm">
      Press <KbdKey>⌘</KbdKey> + <KbdKey>K</KbdKey> to open the search.
    </p>
  )
};
