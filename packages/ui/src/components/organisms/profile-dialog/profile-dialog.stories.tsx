import React, { useState } from "react";


import { ProfileDialog } from "./profile-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof ProfileDialog> = {
  title: "Components/Organisms/ProfileDialog",
  component: ProfileDialog,
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof ProfileDialog>;

export const Default: Story = {
  render: () => {
    const Demo = (): React.JSX.Element => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setOpen(true)}>Open profile</Button>
          <ProfileDialog
            open={open}
            onOpenChange={setOpen}
            user={{
              firstName: "Sophie",
              lastName: "Martin",
              email: "sophie.martin@restaurant.com"
            }}
            onSave={async (data) => {
              console.error("Save", data);
            }}
            onSignOut={async () => {
              setOpen(false);
            }}
          />
        </>
      );
    };

    return <Demo />;
  }
};
