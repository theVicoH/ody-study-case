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
  submit: "Create order",
  clientLabel: "Client",
  clientNone: "No client",
  clientPlaceholder: "Select a client",
  clientModeExisting: "Existing",
  clientModeNew: "New",
  clientFirstNameLabel: "First name",
  clientFirstNamePlaceholder: "Sophie",
  clientLastNameLabel: "Last name",
  clientLastNamePlaceholder: "Martin",
  clientEmailLabel: "Email",
  clientEmailPlaceholder: "name@email.com",
  clientPhoneLabel: "Phone",
  clientPhonePlaceholder: "+1 555 123 4567",
  notesLabel: "Notes",
  notesPlaceholder: "Allergies, instructions...",
  emptyItems: "No items yet. Click Add.",
  addItem: "Add item",
  itemPlaceholder: "Select a dish or menu",
  itemSearchPlaceholder: "Search a dish...",
  itemEmpty: "No dish found.",
  clientSearchPlaceholder: "Search a client...",
  clientEmpty: "No client found.",
  removeItem: "Remove",
  statusPending: "Pending",
  step1Title: "Pick a client",
  step2Title: "Add items",
  step3Title: "Finalize the order",
  stepProgress: "Step {{current}} / {{total}}",
  next: "Next",
  back: "Back",
  selectedClient: "Selected client",
  catalogLabel: "Catalog",
  catalogColName: "Item",
  catalogColPrice: "Price",
  catalogColAdd: "",
  catalogAdd: "Add",
  catalogTypeMenu: "Menu",
  catalogTypeDish: "Dish",
  selectedItemsLabel: "Selected items",
  summaryClient: "Client",
  summaryItems: "Items"
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
