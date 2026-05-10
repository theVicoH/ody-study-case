import { useState } from "react";

import { RESTAURANT_MODELS } from "@workspace/client";

import { Button } from "@/components/ui/button";

import { CreateRestaurantDialog } from "./create-restaurant-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CreateRestaurantDialog> = {
  title: "Organisms/CreateRestaurantDialog",
  component: CreateRestaurantDialog,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof CreateRestaurantDialog>;

export const Default: Story = {
  render: () => {
    const Demo = (): React.JSX.Element => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setOpen(true)}>Open</Button>
          <CreateRestaurantDialog
            open={open}
            onOpenChange={setOpen}
            models={RESTAURANT_MODELS}
            defaultModelId={RESTAURANT_MODELS[0]?.id ?? "corner-shop"}
            labels={{
              title: "Add a restaurant",
              description: "Pick a model and fill in the details.",
              nameLabel: "Name",
              namePlaceholder: "Le Gourmet",
              addressLabel: "Address",
              addressPlaceholder: "1 rue de la Paix, Paris",
              phoneLabel: "Phone",
              phonePlaceholder: "+33 ...",
              maxCoversLabel: "Capacity",
              modelLabel: "3D model",
              cancel: "Cancel",
              submit: "Create"
            }}
            onSubmit={(values) => {
              window.alert(JSON.stringify(values));
              setOpen(false);
            }}
          />
        </>
      );
    };

    return <Demo />;
  }
};
