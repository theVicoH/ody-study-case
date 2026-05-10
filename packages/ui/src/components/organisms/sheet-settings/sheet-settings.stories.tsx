import { SheetSettings } from "./sheet-settings.organism";

import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof SheetSettings> = {
  title: "Components/Organisms/SheetSettings",
  component: SheetSettings,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetSettings>;

const LABELS = {
  generalInfo: "General information",
  name: "Restaurant name",
  address: "Address",
  phone: "Phone",
  maxCovers: "Max covers",
  preferences: "Preferences",
  tableService: "Table service",
  tableServiceDesc: "Enable tablet ordering",
  clickCollect: "Click & collect",
  clickCollectDesc: "Accept takeaway orders",
  kitchenNotif: "Kitchen notifications",
  kitchenNotifDesc: "Beep on new orders",
  testMode: "Test mode",
  testModeDesc: "No orders sent to kitchen",
  save: "Save changes",
  saved: "Saved!",
  openingHours: "Opening hours",
  openingHoursDesc: "Set the days and hours your restaurant is open.",
  dayMonday: "Monday",
  dayTuesday: "Tuesday",
  dayWednesday: "Wednesday",
  dayThursday: "Thursday",
  dayFriday: "Friday",
  daySaturday: "Saturday",
  daySunday: "Sunday",
  openLabel: "Open",
  closedLabel: "Closed",
  openTimeLabel: "Open at",
  closeTimeLabel: "Close at",
  saveHours: "Save hours",
  dangerZone: "Danger zone",
  deleteRestaurant: "Delete restaurant",
  deleteRestaurantDesc: "Permanently remove this restaurant and all related data. This action cannot be undone.",
  tables: "Table management",
  tablesDesc: "Manage the physical tables in the restaurant.",
  tableName: "Name",
  tableNamePlaceholder: "e.g. Window corner",
  tableActive: "Active",
  tableInactive: "Inactive",
  tablesGenerate: "Generate tables",
  tablesGenerateDesc: "Auto-create N tables.",
  tablesGenerateCount: "Number of tables",
  tablesGenerateCapacity: "Seats per table",
  tablesGenerateZone: "Default zone",
  tablesGenerateConfirm: "Generate",
  addTable: "Add a table",
  editTable: "Edit table",
  deleteTable: "Delete",
  colTableNumber: "Table",
  colName: "Name",
  colCapacity: "Capacity",
  colZone: "Zone",
  colTableStatus: "Status",
  colActive: "Active",
  tablesPagePrev: "Previous",
  tablesPageNext: "Next",
  tablesPageInfo: "Page {{current}} / {{total}} · {{count}} tables",
  statusAvailable: "Available",
  statusOccupied: "Occupied",
  statusReserved: "Reserved",
  zoneAll: "All zones",
  zoneSalle: "Dining room",
  zoneTerrasse: "Terrace",
  zoneBar: "Bar",
  zoneVip: "VIP",
  emptyTables: "No tables. Add one to get started.",
  tableNumber: "Table number",
  tableCapacity: "Capacity (seats)",
  tableZone: "Zone",
  tableStatus: "Status",
  confirmDelete: "Delete this table?",
  confirmDeleteDesc: "This action cannot be undone.",
  cancel: "Cancel",
  confirm: "Confirm"
};

const SETTINGS = {
  name: "Le Petit Bistrot",
  address: "12 rue de la Paix, 75001 Paris",
  phone: "+33 1 42 00 00 00",
  maxCovers: 60,
  tableService: true,
  clickAndCollect: false,
  kitchenNotifications: true,
  testMode: false
};

export const Default: Story = {
  args: {
    labels: LABELS,
    settings: SETTINGS,
    tables: []
  }
};

export const WithTables: Story = {
  args: {
    labels: LABELS,
    settings: SETTINGS,
    tables: [
      { id: "t1", number: 1, capacity: 2, zone: "bar", status: "available" },
      { id: "t2", number: 2, capacity: 4, zone: "salle", status: "occupied" },
      { id: "t3", number: 3, capacity: 4, zone: "salle", status: "reserved" },
      { id: "t4", number: 4, capacity: 6, zone: "terrasse", status: "available" },
      { id: "t5", number: 5, capacity: 8, zone: "vip", status: "reserved" }
    ]
  }
};

export const AllEnabled: Story = {
  args: {
    labels: LABELS,
    settings: {
      name: "Restaurant Test",
      address: "1 avenue des Champs-Élysées, 75008 Paris",
      phone: "+33 1 00 00 00 00",
      maxCovers: 120,
      tableService: true,
      clickAndCollect: true,
      kitchenNotifications: true,
      testMode: true
    },
    tables: [
      { id: "t1", number: 1, capacity: 2, zone: "bar", status: "occupied" },
      { id: "t2", number: 2, capacity: 4, zone: "salle", status: "available" }
    ]
  }
};

export const Loading: Story = {
  render: () => (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
};

export const Empty: Story = {
  args: {
    labels: LABELS,
    settings: SETTINGS,
    tables: []
  }
};

export const Error: Story = {
  render: () => (
    <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
      Failed to load settings. Please try again.
    </div>
  )
};
