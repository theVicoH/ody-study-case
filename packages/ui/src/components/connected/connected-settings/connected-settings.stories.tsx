import React, { useState } from "react";

import type { OpeningHourValue, SettingsTableValue, SheetSettingsLabels } from "@/components/organisms/sheet-settings/sheet-settings.organism";
import type { Meta, StoryObj } from "@storybook/react";
import type { RestaurantSettings } from "@workspace/client";

import { SheetSettings } from "@/components/organisms/sheet-settings/sheet-settings.organism";


const meta: Meta = {
  title: "Connected/Settings",
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj;

const LABELS: SheetSettingsLabels = {
  generalInfo: "General information",
  name: "Restaurant name",
  address: "Address",
  phone: "Phone",
  maxCovers: "Max covers",
  preferences: "Preferences",
  tableService: "Table service",
  tableServiceDesc: "Enable tablet ordering at the table",
  clickCollect: "Click & collect",
  clickCollectDesc: "Accept takeaway orders online",
  kitchenNotif: "Kitchen notifications",
  kitchenNotifDesc: "Beep on new orders in the kitchen",
  testMode: "Test mode",
  testModeDesc: "Orders are not sent to the kitchen",
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

const SETTINGS: RestaurantSettings = {
  name: "Le Petit Bistrot",
  address: "12 rue de la Paix, 75001 Paris",
  phone: "+33 1 42 00 00 00",
  maxCovers: 60,
  tableService: true,
  clickAndCollect: false,
  kitchenNotifications: true,
  testMode: false
};

const OPENING_HOURS: ReadonlyArray<OpeningHourValue> = [
  { dayOfWeek: 1, isOpen: true, openTime: "12:00", closeTime: "22:30" },
  { dayOfWeek: 2, isOpen: true, openTime: "12:00", closeTime: "22:30" },
  { dayOfWeek: 3, isOpen: true, openTime: "12:00", closeTime: "22:30" },
  { dayOfWeek: 4, isOpen: true, openTime: "12:00", closeTime: "22:30" },
  { dayOfWeek: 5, isOpen: true, openTime: "12:00", closeTime: "23:00" },
  { dayOfWeek: 6, isOpen: true, openTime: "11:30", closeTime: "23:00" },
  { dayOfWeek: 0, isOpen: false, openTime: "12:00", closeTime: "21:00" }
];

const TABLES: ReadonlyArray<SettingsTableValue> = [
  { id: "t1", number: 1, name: "Window corner", capacity: 2, zone: "salle", status: "available", isActive: true },
  { id: "t2", number: 2, name: null, capacity: 4, zone: "salle", status: "occupied", isActive: true },
  { id: "t3", number: 3, name: null, capacity: 4, zone: "salle", status: "reserved", isActive: true },
  { id: "t4", number: 4, name: "Terrace south", capacity: 6, zone: "terrasse", status: "available", isActive: true },
  { id: "t5", number: 5, name: "VIP lounge", capacity: 8, zone: "vip", status: "reserved", isActive: true },
  { id: "t6", number: 6, name: null, capacity: 3, zone: "bar", status: "available", isActive: false }
];

const SettingsWrapper = (): React.JSX.Element => {
  const [tables, setTables] = useState<ReadonlyArray<SettingsTableValue>>(TABLES);
  const [hours, setHours] = useState<ReadonlyArray<OpeningHourValue>>(OPENING_HOURS);

  return (
    <div className="gap-md flex flex-col" style={{ width: 520 }}>
      <SheetSettings
        labels={LABELS}
        settings={SETTINGS}
        openingHours={hours}
        onSaveOpeningHours={(next) => setHours(next)}
        tablesPaged={tables}
        tablesPage={1}
        tablesTotalPages={1}
        tablesTotal={tables.length}
        onCreateTable={(data) => setTables((prev) => [...prev, { id: `t${Date.now()}`, ...data }])}
        onUpdateTable={(id, data) => setTables((prev) => prev.map((t) => (t.id === id ? { id, ...data } : t)))}
        onDeleteTable={(id) => setTables((prev) => prev.filter((t) => t.id !== id))}
        onDelete={() => { console.error("Delete restaurant triggered"); }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SettingsWrapper />
};

export const Empty: Story = {
  render: () => (
    <div className="gap-md flex flex-col" style={{ width: 520 }}>
      <SheetSettings
        labels={LABELS}
        settings={SETTINGS}
        openingHours={[]}
        tablesPaged={[]}
        tablesPage={1}
        tablesTotalPages={1}
        tablesTotal={0}
      />
    </div>
  )
};

export const AllEnabled: Story = {
  render: () => (
    <div className="gap-md flex flex-col" style={{ width: 520 }}>
      <SheetSettings
        labels={LABELS}
        settings={{
          ...SETTINGS,
          tableService: true,
          clickAndCollect: true,
          kitchenNotifications: true,
          testMode: true
        }}
        openingHours={OPENING_HOURS}
        tablesPaged={TABLES}
        tablesPage={1}
        tablesTotalPages={1}
        tablesTotal={TABLES.length}
      />
    </div>
  )
};

export const Loading: Story = {
  render: () => (
    <div className="gap-md flex flex-col" style={{ width: 520 }}>
      <SheetSettings
        labels={LABELS}
        settings={SETTINGS}
        openingHours={[]}
        tablesPaged={[]}
        tablesLoading
        tablesPage={1}
        tablesTotalPages={1}
        tablesTotal={0}
      />
    </div>
  )
};
