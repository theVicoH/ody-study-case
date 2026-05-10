import { useState } from "react";


import { CreateOrganizationDialog } from "./create-organization-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof CreateOrganizationDialog> = {
  title: "Components/Organisms/CreateOrganizationDialog",
  component: CreateOrganizationDialog,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof CreateOrganizationDialog>;

export const Default: Story = {
  render: () => {
    const Demo = (): React.JSX.Element => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setOpen(true)}>Open</Button>
          <CreateOrganizationDialog
            open={open}
            onOpenChange={setOpen}
            labels={{
              title: "Create organization",
              description: "Set up your team's workspace.",
              nameLabel: "Name",
              namePlaceholder: "Acme Restaurants",
              cancel: "Cancel",
              submit: "Create"
            }}
            onSubmit={(name) => {
              window.alert(`Org: ${name}`);
              setOpen(false);
            }}
          />
        </>
      );
    };

    return <Demo />;
  }
};
