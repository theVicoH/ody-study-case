import React, { useState } from "react";

import type { OrderStatus } from "@workspace/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface NewOrderDialogLabels {
  title: string;
  description: string;
  tableLabel: string;
  itemsLabel: string;
  totalLabel: string;
  statusLabel: string;
  statusNew: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  statusPaid: string;
  cancel: string;
  submit: string;
  clientLabel: string;
  clientNone: string;
  clientPlaceholder: string;
  clientModeExisting: string;
  clientModeNew: string;
  clientFirstNameLabel: string;
  clientFirstNamePlaceholder: string;
  clientLastNameLabel: string;
  clientLastNamePlaceholder: string;
  clientEmailLabel: string;
  clientEmailPlaceholder: string;
  clientPhoneLabel: string;
  clientPhonePlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  emptyItems: string;
  addItem: string;
  itemPlaceholder: string;
  itemSearchPlaceholder: string;
  itemEmpty: string;
  clientSearchPlaceholder: string;
  clientEmpty: string;
  removeItem: string;
  statusPending: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  stepProgress: string;
  next: string;
  back: string;
  selectedClient: string;
  catalogLabel: string;
  catalogColName: string;
  catalogColPrice: string;
  catalogColAdd: string;
  catalogAdd: string;
  catalogTypeMenu: string;
  catalogTypeDish: string;
  selectedItemsLabel: string;
  summaryClient: string;
  summaryItems: string;
}

interface NewOrderFormValues {
  table: number;
  items: number;
  total: number;
  status: OrderStatus;
}

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NewOrderDialogLabels;
  onSubmit: (values: NewOrderFormValues) => void;
}

const DEFAULT_STATUS: OrderStatus = "new";
const DEFAULT_TABLE = 1;
const DEFAULT_ITEMS = 1;
const DEFAULT_TOTAL = 0;

const NewOrderDialog = ({
  open,
  onOpenChange,
  labels,
  onSubmit
}: NewOrderDialogProps): React.JSX.Element => {
  const [table, setTable] = useState<number>(DEFAULT_TABLE);
  const [items, setItems] = useState<number>(DEFAULT_ITEMS);
  const [total, setTotal] = useState<number>(DEFAULT_TOTAL);
  const [status, setStatus] = useState<OrderStatus>(DEFAULT_STATUS);

  const reset = (): void => {
    setTable(DEFAULT_TABLE);
    setItems(DEFAULT_ITEMS);
    setTotal(DEFAULT_TOTAL);
    setStatus(DEFAULT_STATUS);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (table <= 0 || items <= 0) return;

    onSubmit({ table, items, total, status });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex flex-col">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form id="new-order-form" onSubmit={handleSubmit} className="gap-sm flex flex-col">
          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-order-table">{labels.tableLabel}</Label>
            <Input
              id="new-order-table"
              type="number"
              min={1}
              value={table}
              onChange={(event) => setTable(Number(event.target.value))}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-order-items">{labels.itemsLabel}</Label>
            <Input
              id="new-order-items"
              type="number"
              min={1}
              value={items}
              onChange={(event) => setItems(Number(event.target.value))}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-order-total">{labels.totalLabel}</Label>
            <Input
              id="new-order-total"
              type="number"
              min={0}
              step="0.01"
              value={total}
              onChange={(event) => setTotal(Number(event.target.value))}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-order-status">{labels.statusLabel}</Label>
            <Select
              value={status}
              onValueChange={(value) => { if (value !== null) setStatus(value as OrderStatus); }}
            >
              <SelectTrigger id="new-order-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">{labels.statusNew}</SelectItem>
                <SelectItem value="preparing">{labels.statusPreparing}</SelectItem>
                <SelectItem value="ready">{labels.statusReady}</SelectItem>
                <SelectItem value="served">{labels.statusServed}</SelectItem>
                <SelectItem value="paid">{labels.statusPaid}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form="new-order-form">
            {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { NewOrderDialog };

export type {
  NewOrderDialogProps,
  NewOrderDialogLabels,
  NewOrderFormValues
};
