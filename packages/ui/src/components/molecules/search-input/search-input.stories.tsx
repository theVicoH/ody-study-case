import { useState } from "react";

import { SearchInput } from "./search-input.molecule";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SearchInput> = {
  title: "Components/Molecules/SearchInput",
  component: SearchInput,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

const SearchInputDemo = ({ initialValue = "" }: { initialValue?: string }): React.JSX.Element => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="w-80">
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search..."
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SearchInputDemo />
};

export const WithValue: Story = {
  render: () => <SearchInputDemo initialValue="Café Lumière" />
};
