import { ControlTip } from "./control-tip.molecule";

import type { Meta, StoryObj } from "@storybook/react";

import { KbdKey } from "@/components/atoms/kbd-key/kbd-key.atom";

const meta: Meta<typeof ControlTip> = {
  title: "Components/Molecules/ControlTip",
  component: ControlTip,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof ControlTip>;

export const Default: Story = {
  render: () => (
    <ControlTip>
      <KbdKey>drag</KbdKey> rotate · <KbdKey>scroll</KbdKey> zoom · <KbdKey>click</KbdKey> select
    </ControlTip>
  )
};
