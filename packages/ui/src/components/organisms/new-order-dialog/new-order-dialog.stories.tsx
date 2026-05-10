import { useState } from "react";


import { NewOrderDialog } from "./new-order-dialog.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta: Meta<typeof NewOrderDialog> = {
  title: "Components/Organisms/NewOrderDialog",
  component: NewOrderDialog,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof NewOrderDialog>;

const defaultLabels = {
  title: "New order",
  description: "Create a new order.",
  tableLabel: "Table",
  itemsLabel: "Items",
  totalLabel: "Total (€)",
  statusLabel: "Status",
  statusNew: "New",
  statusPreparing: "Preparing",
  statusReady: "Ready",
  statusServed: "Served",
  statusPaid: "Paid",
  cancel: "Cancel",
  submit: "Create order"
};

const NewOrderDialogDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open new order</Button>
      <NewOrderDialog
        open={open}
        onOpenChange={setOpen}
        labels={defaultLabels}
        onSubmit={(values) => { console.error("submit", values); }}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <NewOrderDialogDemo />
};

const NewOrderDialogOpenByDefault = (): React.JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <NewOrderDialog
      open={open}
      onOpenChange={setOpen}
      labels={defaultLabels}
      onSubmit={(values) => { console.error("submit", values); }}
    />
  );
};

export const OpenByDefault: Story = {
  render: () => <NewOrderDialogOpenByDefault />
};

export const CreateMode: Story = {
  render: () => <NewOrderDialogOpenByDefault />
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to create order. Please try again.
    </div>
  )
};
