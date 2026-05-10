import { SheetCrm } from "./sheet-crm.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof SheetCrm> = {
  title: "Components/Organisms/SheetCrm",
  component: SheetCrm,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetCrm>;

const labels = {
  searchPlaceholder: "Search customers…",
  newCustomer: "New customer",
  registeredCustomers: "Registered customers",
  vip: "VIP",
  thisMonth: "this month",
  avgSpend: "Avg spend",
  tagVip: "VIP",
  tagRegular: "Regular",
  tagNew: "New",
  emptySearch: "No customers found.",
  colCustomer: "Customer",
  colVisits: "Visits",
  colSpent: "Spent",
  colTag: "Tag",
  filterAll: "All",
  paginationPrev: "Previous",
  paginationNext: "Next",
  visitsWord: "visits",
  newCustomerDialog: {
    title: "New customer",
    description: "Add a new customer to your CRM.",
    nameLabel: "Name",
    namePlaceholder: "Sophie Martin",
    emailLabel: "Email",
    emailPlaceholder: "name@email.com",
    tagLabel: "Tag",
    tagVip: "VIP",
    tagRegular: "Regular",
    tagNew: "New",
    cancel: "Cancel",
    submit: "Create customer"
  }
};

export const Default: Story = {
  args: {
    labels,
    totalCustomers: 248,
    vipCount: 34,
    customers: [
      {
        id: "1",
        name: "Sophie Martin",
        firstName: "Sophie",
        lastName: "Martin",
        email: "sophie.martin@email.com",
        visits: 12,
        spent: 480,
        tag: "VIP"
      },
      {
        id: "2",
        name: "Julien Bernard",
        firstName: "Julien",
        lastName: "Bernard",
        email: "julien.bernard@email.com",
        visits: 5,
        spent: 180,
        tag: "Regular"
      },
      {
        id: "3",
        name: "Camille Durand",
        firstName: "Camille",
        lastName: "Durand",
        email: "camille.durand@email.com",
        visits: 1,
        spent: 35,
        tag: "New"
      },
      {
        id: "4",
        name: "Marc Lefevre",
        firstName: "Marc",
        lastName: "Lefevre",
        email: "marc.lefevre@email.com",
        visits: 8,
        spent: 320,
        tag: "VIP"
      }
    ]
  }
};

export const Empty: Story = {
  args: {
    labels,
    totalCustomers: 0,
    vipCount: 0,
    customers: []
  }
};

export const Loading: Story = {
  render: () => (
    <div className="space-y-2 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load CRM data. Please try again.
    </div>
  )
};
