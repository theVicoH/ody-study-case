import { useState } from "react";


import { RestaurantPickerDialog } from "./restaurant-picker-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof RestaurantPickerDialog> = {
  title: "Components/Organisms/RestaurantPickerDialog",
  component: RestaurantPickerDialog,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof RestaurantPickerDialog>;

const defaultLabels = {
  title: "Select a restaurant",
  description: "Choose the restaurant you want to create this in.",
  searchPlaceholder: "Search restaurants…",
  empty: "No restaurant matches.",
  cancel: "Cancel",
  submit: "Continue"
};

const sampleRestaurants = [
  { id: "r1", name: "La Table d'Or", address: "12 rue Saint-Germain, Paris" },
  { id: "r2", name: "Bistro Marais", address: "5 rue de Bretagne, Paris" },
  { id: "r3", name: "Café Lumière", address: "21 bd Voltaire, Paris" }
];

const Demo = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open picker</Button>
      <RestaurantPickerDialog
        open={open}
        onOpenChange={setOpen}
        labels={defaultLabels}
        restaurants={sampleRestaurants}
        onSelect={(id) => { console.error("selected", id); }}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <Demo />
};

const OpenDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <RestaurantPickerDialog
      open={open}
      onOpenChange={setOpen}
      labels={defaultLabels}
      restaurants={sampleRestaurants}
      onSelect={(id) => { console.error("selected", id); }}
    />
  );
};

export const OpenByDefault: Story = {
  render: () => <OpenDemo />
};

const EmptyDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <RestaurantPickerDialog
      open={open}
      onOpenChange={setOpen}
      labels={defaultLabels}
      restaurants={[]}
      onSelect={(id) => { console.error("selected", id); }}
    />
  );
};

export const Empty: Story = {
  render: () => <EmptyDemo />
};
