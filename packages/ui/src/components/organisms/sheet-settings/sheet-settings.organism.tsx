import React, { useState } from "react";

import { PencilIcon } from "@/components/icons/pencil/pencil.icon";
import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { TrashIcon } from "@/components/icons/trash/trash.icon";

import type { RestaurantSettings, RestaurantTable, TableStatus, TableZone } from "@workspace/client";

import { Muted } from "@/components/atoms/typography/typography.atom";
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

interface TableFormState {
  number: string;
  capacity: string;
  zone: TableZone;
  status: TableStatus;
}

const DEFAULT_FORM: TableFormState = {
  number: "",
  capacity: "",
  zone: "salle",
  status: "available"
};

interface TableDialogLabels {
  title: string;
  tableNumber: string;
  tableCapacity: string;
  tableZone: string;
  tableStatus: string;
  cancel: string;
  confirm: string;
  zoneLabels: Record<TableZone, string>;
  statusLabels: Record<TableStatus, string>;
}

interface TableDialogProps {
  labels: TableDialogLabels;
  initial?: RestaurantTable;
  trigger: React.ReactNode;
  onSubmit: (data: Omit<RestaurantTable, "id">) => void;
}

const TableDialog = ({
  labels,
  initial,
  trigger,
  onSubmit
}: TableDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TableFormState>(initial
    ? { number: String(initial.number), capacity: String(initial.capacity), zone: initial.zone, status: initial.status }
    : DEFAULT_FORM);

  const handleOpen = (v: boolean): void => {
    setOpen(v);
    if (v && initial) {
      setForm({ number: String(initial.number), capacity: String(initial.capacity), zone: initial.zone, status: initial.status });
    } else if (v) {
      setForm(DEFAULT_FORM);
    }
  };

  const handleSubmit = (): void => {
    const number = parseInt(form.number, 10);
    const capacity = parseInt(form.capacity, 10);

    if (!number || !capacity) return;
    onSubmit({ number, capacity, zone: form.zone, status: form.status });
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

interface SheetSettingsLabels {
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
  dangerZone: string;
  deleteRestaurant: string;
  deleteRestaurantDesc: string;
  tables: string;
  tablesDesc: string;
  addTable: string;
  editTable: string;
  deleteTable: string;
  colTableNumber: string;
  colCapacity: string;
  colZone: string;
  colTableStatus: string;
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

interface SheetSettingsProps {
  labels: SheetSettingsLabels;
  settings: RestaurantSettings;
  tables?: ReadonlyArray<RestaurantTable>;
  onDelete?: () => void;
}

const STATUS_CLASS: Record<TableStatus, string> = {
  available: "bg-status-good/15 text-status-good",
  occupied: "bg-status-bad/15 text-status-bad",
  reserved: "bg-status-warn/15 text-status-warn"
};

const SheetSettings = ({
  labels,
  settings,
  tables: initialTables = [],
  onDelete
}: SheetSettingsProps): React.JSX.Element => {
  const [tableService, setTableService] = useState(settings.tableService);
  const [clickAndCollect, setClickAndCollect] = useState(settings.clickAndCollect);
  const [kitchenNotifications, setKitchenNotifications] = useState(settings.kitchenNotifications);
  const [testMode, setTestMode] = useState(settings.testMode);
  const [saved, setSaved] = useState(false);
  const [tables, setTables] = useState<ReadonlyArray<RestaurantTable>>(initialTables);

  const handleSave = (): void => {
    setSaved(true);
    setTimeout(() => setSaved(false), SAVE_FEEDBACK_DURATION_MS);
  };

  const handleAddTable = (data: Omit<RestaurantTable, "id">): void => {
    const id = `table-${Date.now()}`;

    setTables((prev) => [...prev, { id, ...data }]);
  };

  const handleEditTable = (id: string, data: Omit<RestaurantTable, "id">): void => {
    setTables((prev) => prev.map((t) => (t.id === id ? { id, ...data } : t)));
  };

  const handleDeleteTable = (id: string): void => {
    setTables((prev) => prev.filter((t) => t.id !== id));
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

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{labels.generalInfo}</CardTitle>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "px-md py-xs typo-button rounded-md transition-all",
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
            <label className="text-muted-foreground typo-overline">
              {labels.name}
            </label>
            <Input defaultValue={settings.name} />
          </div>

          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">
              {labels.address}
            </label>
            <Input defaultValue={settings.address} />
          </div>

          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">
                {labels.phone}
              </label>
              <Input defaultValue={settings.phone} />
            </div>

            <div className="gap-xs flex flex-col">
              <label className="text-muted-foreground typo-overline">
                {labels.maxCovers}
              </label>
              <Input type="number" defaultValue={settings.maxCovers} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{labels.openingHours}</CardTitle>
        </CardHeader>
        <CardContent>
          <Muted className="typo-caption">{labels.openingHoursDesc}</Muted>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{labels.preferences}</CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          <ToggleRow
            label={labels.tableService}
            description={labels.tableServiceDesc}
            checked={tableService}
            onChange={setTableService}
          />
          <ToggleRow
            label={labels.clickCollect}
            description={labels.clickCollectDesc}
            checked={clickAndCollect}
            onChange={setClickAndCollect}
          />
          <ToggleRow
            label={labels.kitchenNotif}
            description={labels.kitchenNotifDesc}
            checked={kitchenNotifications}
            onChange={setKitchenNotifications}
          />
          <ToggleRow
            label={labels.testMode}
            description={labels.testModeDesc}
            checked={testMode}
            onChange={setTestMode}
          />
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
              labels={{
                title: labels.addTable,
                tableNumber: labels.tableNumber,
                tableCapacity: labels.tableCapacity,
                tableZone: labels.tableZone,
                tableStatus: labels.tableStatus,
                cancel: labels.cancel,
                confirm: labels.confirm,
                zoneLabels,
                statusLabels
              }}
              onSubmit={handleAddTable}
              trigger={
                <button
                  type="button"
                  className="bg-primary text-primary-foreground gap-2xs px-sm py-xs typo-button inline-flex items-center rounded-md transition-all hover:opacity-90"
                >
                  <PlusIcon size={ICON_SIZE} />
                  {labels.addTable}
                </button>
              }
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {tables.length === 0 ? (
            <p className="text-muted-foreground typo-caption px-md py-lg text-center">
              {labels.emptyTables}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground typo-overline">{labels.colTableNumber}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colCapacity}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colZone}</TableHead>
                  <TableHead className="text-muted-foreground typo-overline">{labels.colTableStatus}</TableHead>
                  <TableHead className="w-3xl" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="typo-button">T{table.number}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>{zoneLabels[table.zone]}</TableCell>
                    <TableCell>
                      <span className={cn("typo-caption px-xs py-3xs inline-flex items-center rounded-full", STATUS_CLASS[table.status])}>
                        {statusLabels[table.status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="gap-2xs flex items-center justify-end">
                        <TableDialog
                          labels={{
                            title: labels.editTable,
                            tableNumber: labels.tableNumber,
                            tableCapacity: labels.tableCapacity,
                            tableZone: labels.tableZone,
                            tableStatus: labels.tableStatus,
                            cancel: labels.cancel,
                            confirm: labels.confirm,
                            zoneLabels,
                            statusLabels
                          }}
                          initial={table}
                          onSubmit={(data) => handleEditTable(table.id, data)}
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
                          onConfirm={() => handleDeleteTable(table.id)}
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
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">{labels.dangerZone}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-xs gap-sm flex items-center justify-between">
            <div className="gap-xs flex flex-col">
              <p className="text-foreground typo-button">
                {labels.deleteRestaurant}
              </p>
              <Muted className="typo-caption">{labels.deleteRestaurantDesc}</Muted>
            </div>
            <button
              type="button"
              onClick={onDelete}
              className={cn("bg-destructive/10 text-destructive hover:bg-destructive/20 px-md py-xs typo-button rounded-md transition-all")}
            >
              {labels.deleteRestaurant}
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { SheetSettings };

export type { SheetSettingsProps, SheetSettingsLabels };
