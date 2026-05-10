import { useState } from "react";


import { NewCustomerDialog } from "./new-customer-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof NewCustomerDialog> = {
  title: "Components/Organisms/NewCustomerDialog",
  component: NewCustomerDialog,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof NewCustomerDialog>;

const defaultLabels = {
  title: "New customer",
  description: "Add a new customer to your CRM.",
  nameLabel: "Name",
  namePlaceholder: "Sophie Martin",
  emailLabel: "Email",
  emailPlaceholder: "sophie@email.com",
  tagLabel: "Tag",
  tagVip: "VIP",
  tagRegular: "Regular",
  tagNew: "New",
  cancel: "Cancel",
  submit: "Create"
};

const NewCustomerDialogDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open new customer</Button>
      <NewCustomerDialog
        open={open}
        onOpenChange={setOpen}
        labels={defaultLabels}
        onSubmit={(values) => { console.error("submit", values); }}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <NewCustomerDialogDemo />
};
