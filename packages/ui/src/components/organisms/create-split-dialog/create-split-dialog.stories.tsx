import React, { useState } from "react";


import { CreateSplitDialog } from "./create-split-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof CreateSplitDialog> = {
  title: "Components/Organisms/CreateSplitDialog",
  component: CreateSplitDialog,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof CreateSplitDialog>;

const restaurants = [
  { id: "1", name: "Soldout Saint-Germain", status: "good" as const },
  { id: "2", name: "Soldout Marais", status: "warn" as const },
  { id: "3", name: "Soldout Bastille", status: "bad" as const }
];

const pages = [
  { id: "home", label: "Home" },
  { id: "stats", label: "Stats" },
  { id: "crm", label: "CRM" },
  { id: "orders", label: "Orders" },
  { id: "menu", label: "Menu" },
  { id: "settings", label: "Settings" }
];

const labels = {
  title: "Open a second view",
  description: "Pick a restaurant and a page to display side by side.",
  restaurantLabel: "Restaurant",
  pageLabel: "Page",
  cancel: "Cancel",
  submit: "Open"
};

const StoryHarness = (): React.JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-md">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <CreateSplitDialog
        open={open}
        onOpenChange={setOpen}
        restaurants={restaurants}
        pages={pages}
        labels={labels}
        onSubmit={() => setOpen(false)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <StoryHarness />
};
