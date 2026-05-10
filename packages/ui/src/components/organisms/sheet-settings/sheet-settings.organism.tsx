import React, { useEffect, useMemo, useState } from "react";

import type { RestaurantSettings, RestaurantTable, TableStatus, TableZone } from "@workspace/client";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { PencilIcon } from "@/components/icons/pencil/pencil.icon";
import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { TrashIcon } from "@/components/icons/trash/trash.icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";


const SAVE_FEEDBACK_DURATION_MS = 2000;
const ICON_SIZE = 14;
const DAYS_IN_WEEK = 7;

const ZONES: ReadonlyArray<TableZone> = ["salle", "terrasse", "bar", "vip"];
const STATUSES: ReadonlyArray<TableStatus> = ["available", "occupied", "reserved"];

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow = ({
  label,
  description,
  checked,
  onChange
}: ToggleRowProps): React.JSX.Element => (
  <div className="py-xs flex items-center justify-between">
    <div className="gap-xs flex flex-col">
      <p className={cn("text-foreground typo-button")}>{label}</p>
      <Muted className="typo-caption">{description}</Muted>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export interface OpeningHourValue {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SettingsTableValue {
  id: string;
  number: number;
  name: string | null;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  isActive: boolean;
}

interface TableFormState {
  number: string;
  name: string;
  capacity: string;
  zone: TableZone;
  status: TableStatus;
  isActive: boolean;
}

const DEFAULT_FORM: TableFormState = {
  number: "",
  name: "",
  capacity: "2",
  zone: "salle",
  status: "available",
  isActive: true
};

interface TableDialogLabels {
  title: string;
  tableNumber: string;
  tableName: string;
  tableNamePlaceholder: string;
  tableCapacity: string;
  tableZone: string;
  tableStatus: string;
  tableActive: string;
  cancel: string;
  confirm: string;
  zoneLabels: Record<TableZone, string>;
  statusLabels: Record<TableStatus, string>;
}

interface TableDialogProps {
  labels: TableDialogLabels;
  initial?: SettingsTableValue;
  trigger: React.ReactNode;
  onSubmit: (data: Omit<SettingsTableValue, "id">) => void;
}

const TableDialog = ({
  labels,
  initial,
  trigger,
  onSubmit
}: TableDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TableFormState>(initial
    ? {
      number: String(initial.number),
      name: initial.name ?? "",
      capacity: String(initial.capacity),
      zone: initial.zone,
      status: initial.status,
      isActive: initial.isActive
    }
    : DEFAULT_FORM);

  const handleOpen = (v: boolean): void => {
    setOpen(v);
    if (v && initial) {
      setForm({
        number: String(initial.number),
        name: initial.name ?? "",
        capacity: String(initial.capacity),
        zone: initial.zone,
        status: initial.status,
        isActive: initial.isActive
      });
    } else if (v) {
      setForm(DEFAULT_FORM);
    }
  };

  const handleSubmit = (): void => {
    const number = parseInt(form.number, 10);
    const capacity = parseInt(form.capacity, 10);

    if (!number || !capacity) return;
    onSubmit({
      number,
      name: form.name.trim() ? form.name.trim() : null,
      capacity,
      zone: form.zone,
      status: form.status,
      isActive: form.isActive
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription className="sr-only">{labels.title}</DialogDescription>
        </DialogHeader>

        <div className="gap-sm flex flex-col">
          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.tableNumber}</label>
              <Input
                type="number"
                min={1}
                value={form.number}
                onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
              />
            </div>

            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.tableCapacity}</label>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
              />
            </div>
          </div>

          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">{labels.tableName}</label>
            <Input
              type="text"
              placeholder={labels.tableNamePlaceholder}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.tableZone}</label>
              <Select value={form.zone} onValueChange={(v) => setForm((p) => ({ ...p, zone: v as TableZone }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>{labels.zoneLabels[z]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.tableStatus}</label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as TableStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{labels.statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="py-xs flex items-center justify-between">
            <label className="text-foreground typo-button">{labels.tableActive}</label>
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<button type="button" className="border-border text-foreground hover:bg-muted/50 px-md py-xs typo-button rounded-md border bg-transparent transition-colors" />}>
            {labels.cancel}
          </DialogClose>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground px-md py-xs typo-button rounded-md transition-all hover:opacity-90"
          >
            {labels.confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteDialogProps {
  labels: { title: string; description: string; cancel: string; confirm: string };
  trigger: React.ReactNode;
  onConfirm: () => void;
}

const DeleteDialog = ({ labels, trigger, onConfirm }: DeleteDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleConfirm = (): void => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<button type="button" className="border-border text-foreground hover:bg-muted/50 px-md py-xs typo-button rounded-md border bg-transparent transition-colors" />}>
            {labels.cancel}
          </DialogClose>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-md py-xs typo-button rounded-md transition-all"
          >
            {labels.confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface SheetSettingsLabels {
  generalInfo: string;
  name: string;
  address: string;
  phone: string;
  maxCovers: string;
  preferences: string;
  tableService: string;
  tableServiceDesc: string;
  clickCollect: string;
  clickCollectDesc: string;
  kitchenNotif: string;
  kitchenNotifDesc: string;
  testMode: string;
  testModeDesc: string;
  save: string;
  saved: string;
  openingHours: string;
  openingHoursDesc: string;
  dayMonday: string;
  dayTuesday: string;
  dayWednesday: string;
  dayThursday: string;
  dayFriday: string;
  daySaturday: string;
  daySunday: string;
  openLabel: string;
  closedLabel: string;
  openTimeLabel: string;
  closeTimeLabel: string;
  saveHours: string;
  dangerZone: string;
  deleteRestaurant: string;
  deleteRestaurantDesc: string;
  tables: string;
  tablesDesc: string;
  tableName: string;
  tableNamePlaceholder: string;
  tableActive: string;
  tableInactive: string;
  tablesGenerate: string;
  tablesGenerateDesc: string;
  tablesGenerateCount: string;
  tablesGenerateCapacity: string;
  tablesGenerateZone: string;
  tablesGenerateConfirm: string;
  addTable: string;
  editTable: string;
  deleteTable: string;
  colTableNumber: string;
  colName: string;
  colCapacity: string;
  colZone: string;
  colTableStatus: string;
  colActive: string;
  tablesPagePrev: string;
  tablesPageNext: string;
  tablesPageInfo: string;
  statusAvailable: string;
  statusOccupied: string;
  statusReserved: string;
  zoneAll: string;
  zoneSalle: string;
  zoneTerrasse: string;
  zoneBar: string;
  zoneVip: string;
  emptyTables: string;
  tableNumber: string;
  tableCapacity: string;
  tableZone: string;
  tableStatus: string;
  confirmDelete: string;
  confirmDeleteDesc: string;
  cancel: string;
  confirm: string;
}

export interface SheetSettingsProps {
  labels: SheetSettingsLabels;
  settings: RestaurantSettings;
  tables?: ReadonlyArray<RestaurantTable>;
  onDelete?: () => void;
  onSaveGeneral?: (input: { name: string; address: string; phone: string; maxCovers: number }) => Promise<void> | void;
  openingHours?: ReadonlyArray<OpeningHourValue>;
  onSaveOpeningHours?: (hours: ReadonlyArray<OpeningHourValue>) => Promise<void> | void;
  tablesPaged?: ReadonlyArray<SettingsTableValue>;
  tablesPage?: number;
  tablesTotalPages?: number;
  tablesTotal?: number;
  tablesLoading?: boolean;
  onTablesPageChange?: (page: number) => void;
  onCreateTable?: (data: Omit<SettingsTableValue, "id">) => Promise<unknown> | void;
  onUpdateTable?: (id: string, data: Omit<SettingsTableValue, "id">) => Promise<unknown> | void;
  onDeleteTable?: (id: string) => Promise<unknown> | void;
}

const STATUS_CLASS: Record<TableStatus, string> = {
  available: "bg-status-good/15 text-status-good",
  occupied: "bg-status-bad/15 text-status-bad",
  reserved: "bg-status-warn/15 text-status-warn"
};

interface OpeningHoursEditorProps {
  labels: SheetSettingsLabels;
  hours: ReadonlyArray<OpeningHourValue>;
  onChange: (next: ReadonlyArray<OpeningHourValue>) => void;
}

const OpeningHoursEditor = ({ labels, hours, onChange }: OpeningHoursEditorProps): React.JSX.Element => {
  const dayLabels: ReadonlyArray<string> = [
    labels.daySunday,
    labels.dayMonday,
    labels.dayTuesday,
    labels.dayWednesday,
    labels.dayThursday,
    labels.dayFriday,
    labels.daySaturday
  ];
  const ordered = Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
    const dayOfWeek = (i + 1) % DAYS_IN_WEEK;

    return hours.find((h) => h.dayOfWeek === dayOfWeek) ?? {
      dayOfWeek,
      isOpen: dayOfWeek !== 0,
      openTime: "12:00",
      closeTime: "22:30"
    };
  });

  const updateDay = (dayOfWeek: number, patch: Partial<OpeningHourValue>): void => {
    const merged = ordered.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, ...patch } : h));

    onChange(merged);
  };

  return (
    <div className="gap-sm flex flex-col">
      {ordered.map((h) => (
        <div key={h.dayOfWeek} className="gap-sm grid grid-cols-[1fr_auto_auto_auto] items-center">
          <span className="text-foreground typo-button">{dayLabels[h.dayOfWeek]}</span>
          <Switch checked={h.isOpen} onCheckedChange={(v) => updateDay(h.dayOfWeek, { isOpen: v })} />
          <Input
            type="time"
            disabled={!h.isOpen}
            value={h.openTime}
            onChange={(e) => updateDay(h.dayOfWeek, { openTime: e.target.value })}
            className="w-28 [color-scheme:dark]"
          />
          <Input
            type="time"
            disabled={!h.isOpen}
            value={h.closeTime}
            onChange={(e) => updateDay(h.dayOfWeek, { closeTime: e.target.value })}
            className="w-28 [color-scheme:dark]"
          />
        </div>
      ))}
    </div>
  );
};

const fallbackTablesToValues = (tables: ReadonlyArray<RestaurantTable>): SettingsTableValue[] =>
  tables.map((t) => ({
    id: t.id,
    number: t.number,
    name: null,
    capacity: t.capacity,
    zone: t.zone,
    status: t.status,
    isActive: true
  }));

const SheetSettings = ({
  labels,
  settings,
  tables: legacyTables = [],
  onDelete,
  onSaveGeneral,
  openingHours,
  onSaveOpeningHours,
  tablesPaged,
  tablesPage,
  tablesTotalPages,
  tablesTotal,
  tablesLoading = false,
  onTablesPageChange,
  onCreateTable,
  onUpdateTable,
  onDeleteTable
}: SheetSettingsProps): React.JSX.Element => {
  const [name, setName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [maxCovers, setMaxCovers] = useState(String(settings.maxCovers));
  const [tableService, setTableService] = useState(settings.tableService);
  const [clickAndCollect, setClickAndCollect] = useState(settings.clickAndCollect);
  const [kitchenNotifications, setKitchenNotifications] = useState(settings.kitchenNotifications);
  const [testMode, setTestMode] = useState(settings.testMode);
  const [saved, setSaved] = useState(false);

  const [hoursDraft, setHoursDraft] = useState<ReadonlyArray<OpeningHourValue>>(openingHours ?? []);
  const [hoursSaved, setHoursSaved] = useState(false);

  const isGeneralDirty =
    name !== settings.name ||
    address !== settings.address ||
    phone !== settings.phone ||
    maxCovers !== String(settings.maxCovers) ||
    tableService !== settings.tableService ||
    clickAndCollect !== settings.clickAndCollect ||
    kitchenNotifications !== settings.kitchenNotifications ||
    testMode !== settings.testMode;

  const isHoursDirty = useMemo(() => {
    if (!openingHours) return hoursDraft.length > 0;
    if (hoursDraft.length !== openingHours.length) return true;
    const byDay = new Map(openingHours.map((h) => [h.dayOfWeek, h]));

    return hoursDraft.some((h) => {
      const ref = byDay.get(h.dayOfWeek);

      return !ref || ref.isOpen !== h.isOpen || ref.openTime !== h.openTime || ref.closeTime !== h.closeTime;
    });
  }, [hoursDraft, openingHours]);

  useEffect(() => {
    if (openingHours) setHoursDraft(openingHours);
  }, [openingHours]);

  useEffect(() => {
    setName(settings.name);
    setAddress(settings.address);
    setPhone(settings.phone);
    setMaxCovers(String(settings.maxCovers));
    setTableService(settings.tableService);
    setClickAndCollect(settings.clickAndCollect);
    setKitchenNotifications(settings.kitchenNotifications);
    setTestMode(settings.testMode);
  }, [settings]);

  const [localTables, setLocalTables] = useState<ReadonlyArray<SettingsTableValue>>(fallbackTablesToValues(legacyTables));
  const tablesSource: ReadonlyArray<SettingsTableValue> = tablesPaged ?? localTables;

  const handleSave = async (): Promise<void> => {
    const covers = parseInt(maxCovers, 10);

    if (onSaveGeneral && Number.isFinite(covers) && covers > 0) {
      await onSaveGeneral({ name, address, phone, maxCovers: covers });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), SAVE_FEEDBACK_DURATION_MS);
  };

  const handleSaveHours = async (): Promise<void> => {
    if (onSaveOpeningHours) {
      await onSaveOpeningHours(hoursDraft);
    }
    setHoursSaved(true);
    setTimeout(() => setHoursSaved(false), SAVE_FEEDBACK_DURATION_MS);
  };

  const handleAddTable = async (data: Omit<SettingsTableValue, "id">): Promise<void> => {
    if (onCreateTable) {
      await onCreateTable(data);

      return;
    }
    const id = `table-${Date.now()}`;

    setLocalTables((prev) => [...prev, { id, ...data }]);
  };

  const handleEditTable = async (id: string, data: Omit<SettingsTableValue, "id">): Promise<void> => {
    if (onUpdateTable) {
      await onUpdateTable(id, data);

      return;
    }
    setLocalTables((prev) => prev.map((t) => (t.id === id ? { id, ...data } : t)));
  };

  const handleDeleteTable = async (id: string): Promise<void> => {
    if (onDeleteTable) {
      await onDeleteTable(id);

      return;
    }
    setLocalTables((prev) => prev.filter((t) => t.id !== id));
  };

  const zoneLabels: Record<TableZone, string> = {
    salle: labels.zoneSalle,
    terrasse: labels.zoneTerrasse,
    bar: labels.zoneBar,
    vip: labels.zoneVip
  };

  const statusLabels: Record<TableStatus, string> = {
    available: labels.statusAvailable,
    occupied: labels.statusOccupied,
    reserved: labels.statusReserved
  };

  const dialogLabels = useMemo<TableDialogLabels>(() => ({
    title: labels.addTable,
    tableNumber: labels.tableNumber,
    tableName: labels.tableName,
    tableNamePlaceholder: labels.tableNamePlaceholder,
    tableCapacity: labels.tableCapacity,
    tableZone: labels.tableZone,
    tableStatus: labels.tableStatus,
    tableActive: labels.tableActive,
    cancel: labels.cancel,
    confirm: labels.confirm,
    zoneLabels,
    statusLabels
  }), [labels]);

  const currentPage = tablesPage ?? 1;
  const currentTotalPages = tablesTotalPages ?? 1;
  const currentTotal = tablesTotal ?? tablesSource.length;

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{labels.generalInfo}</CardTitle>
            <button
              type="button"
              onClick={() => { void handleSave(); }}
              disabled={!isGeneralDirty && !saved}
              className={cn(
                "px-sm py-2xs typo-caption rounded-md transition-all disabled:cursor-not-allowed disabled:opacity-40",
                saved
                  ? "bg-status-good/20 text-status-good"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </CardHeader>
        <CardContent className="gap-md flex flex-col">
          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">{labels.name}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">{labels.address}</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.phone}</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">{labels.maxCovers}</label>
              <Input
                type="number"
                value={maxCovers}
                onChange={(e) => setMaxCovers(e.target.value)}
              />
            </div>
          </div>

          <div className="gap-sm border-border flex flex-col border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="gap-xs flex flex-col">
                <p className="text-foreground typo-button">{labels.openingHours}</p>
                <Muted className="typo-caption">{labels.openingHoursDesc}</Muted>
              </div>
              <button
                type="button"
                onClick={() => { void handleSaveHours(); }}
                disabled={!isHoursDirty && !hoursSaved}
                className={cn(
                  "px-sm py-2xs typo-caption rounded-md transition-all disabled:cursor-not-allowed disabled:opacity-40",
                  hoursSaved
                    ? "bg-status-good/20 text-status-good"
                    : "border-border text-foreground hover:bg-muted/50 border bg-transparent"
                )}
              >
                {hoursSaved ? labels.saved : labels.saveHours}
              </button>
            </div>
            <OpeningHoursEditor labels={labels} hours={hoursDraft} onChange={setHoursDraft} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{labels.preferences}</CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          <ToggleRow label={labels.tableService} description={labels.tableServiceDesc} checked={tableService} onChange={setTableService} />
          <ToggleRow label={labels.clickCollect} description={labels.clickCollectDesc} checked={clickAndCollect} onChange={setClickAndCollect} />
          <ToggleRow label={labels.kitchenNotif} description={labels.kitchenNotifDesc} checked={kitchenNotifications} onChange={setKitchenNotifications} />
          <ToggleRow label={labels.testMode} description={labels.testModeDesc} checked={testMode} onChange={setTestMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="gap-xs flex flex-col">
              <CardTitle>{labels.tables}</CardTitle>
              <Muted className="typo-caption">{labels.tablesDesc}</Muted>
            </div>
            <TableDialog
              labels={{ ...dialogLabels, title: labels.addTable }}
              onSubmit={(data) => { void handleAddTable(data); }}
              trigger={
                <button
                  type="button"
                  className="bg-primary text-primary-foreground gap-2xs px-sm py-2xs typo-caption inline-flex items-center rounded-md transition-all hover:opacity-90"
                >
                  <PlusIcon size={12} />
                  {labels.addTable}
                </button>
              }
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 [&_[data-slot=table-container]]:[scrollbar-width:none] [&_[data-slot=table-container]::-webkit-scrollbar]:hidden">
          {tablesSource.length === 0 ? (
            <p className="text-muted-foreground typo-caption px-md py-lg text-center">
              {tablesLoading ? "…" : labels.emptyTables}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground typo-overline">{labels.colTableNumber}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colName}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colCapacity}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colZone}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colTableStatus}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colActive}</TableHead>
                  <TableHead className="w-3xl" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tablesSource.map((table) => (
                  <TableRow key={table.id} className={cn(!table.isActive && "opacity-50")}>
                    <TableCell className="typo-button">T{table.number}</TableCell>
                    <TableCell className="text-muted-foreground">{table.name ?? "—"}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>{zoneLabels[table.zone]}</TableCell>
                    <TableCell>
                      <span className={cn("typo-caption px-xs py-3xs inline-flex items-center rounded-full", STATUS_CLASS[table.status])}>
                        {statusLabels[table.status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={table.isActive}
                        onCheckedChange={(v) => { void handleEditTable(table.id, { ...table, isActive: v }); }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="gap-2xs flex items-center justify-end">
                        <TableDialog
                          labels={{ ...dialogLabels, title: labels.editTable }}
                          initial={table}
                          onSubmit={(data) => { void handleEditTable(table.id, data); }}
                          trigger={
                            <button
                              type="button"
                              aria-label={labels.editTable}
                              className="text-muted-foreground hover:text-foreground size-xl inline-flex items-center justify-center rounded-sm transition-colors"
                            >
                              <PencilIcon size={ICON_SIZE} />
                            </button>
                          }
                        />
                        <DeleteDialog
                          labels={{
                            title: labels.confirmDelete,
                            description: labels.confirmDeleteDesc,
                            cancel: labels.cancel,
                            confirm: labels.deleteTable
                          }}
                          onConfirm={() => { void handleDeleteTable(table.id); }}
                          trigger={
                            <button
                              type="button"
                              aria-label={labels.deleteTable}
                              className="text-muted-foreground hover:text-destructive size-xl inline-flex items-center justify-center rounded-sm transition-colors"
                            >
                              <TrashIcon size={ICON_SIZE} />
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {onTablesPageChange && currentTotalPages > 1 ? (
            <div className="border-border px-md py-xs flex items-center justify-between border-t">
              <span className="text-muted-foreground typo-caption">
                {labels.tablesPageInfo
                  .replace("{{current}}", String(currentPage))
                  .replace("{{total}}", String(currentTotalPages))
                  .replace("{{count}}", String(currentTotal))}
              </span>
              <div className="gap-xs flex items-center">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => onTablesPageChange(currentPage - 1)}
                  className="border-border text-foreground hover:bg-muted/50 px-sm py-2xs typo-button rounded-md border bg-transparent transition-colors disabled:opacity-40"
                >
                  {labels.tablesPagePrev}
                </button>
                <button
                  type="button"
                  disabled={currentPage >= currentTotalPages}
                  onClick={() => onTablesPageChange(currentPage + 1)}
                  className="border-border text-foreground hover:bg-muted/50 px-sm py-2xs typo-button rounded-md border bg-transparent transition-colors disabled:opacity-40"
                >
                  {labels.tablesPageNext}
                </button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">{labels.dangerZone}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-xs gap-sm flex items-center justify-between">
            <div className="gap-xs flex flex-col">
              <p className="text-foreground typo-button">{labels.deleteRestaurant}</p>
              <Muted className="typo-caption">{labels.deleteRestaurantDesc}</Muted>
            </div>
            <DeleteDialog
              labels={{
                title: labels.deleteRestaurant,
                description: labels.deleteRestaurantDesc,
                cancel: labels.cancel,
                confirm: labels.deleteRestaurant
              }}
              onConfirm={() => { if (onDelete) onDelete(); }}
              trigger={
                <button
                  type="button"
                  className={cn("bg-destructive/10 text-destructive hover:bg-destructive/20 px-md py-xs typo-button rounded-md transition-all")}
                >
                  {labels.deleteRestaurant}
                </button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { SheetSettings };
