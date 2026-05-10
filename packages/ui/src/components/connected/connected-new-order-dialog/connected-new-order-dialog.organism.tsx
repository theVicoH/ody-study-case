import React, { useMemo, useState } from "react";

import { useClients, useCreateOrder, useDishes, useMenus } from "@workspace/client";

import type { ApiOrderStatus } from "@workspace/client";

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

const CENTS_PER_EURO = 100;
const NO_CLIENT_VALUE = "__none__";

export interface ConnectedNewOrderDialogLabels {
  title: string;
  description: string;
  clientLabel: string;
  clientNone: string;
  notesLabel: string;
  itemsLabel: string;
  emptyItems: string;
  addItem: string;
  totalLabel: string;
  statusLabel: string;
  statusNew: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  statusPaid: string;
  cancel: string;
  submit: string;
}

interface ConnectedNewOrderDialogProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: ConnectedNewOrderDialogLabels;
}

interface DraftItem {
  uid: string;
  kind: "menu" | "dish";
  refId: string;
  quantity: number;
}

const DEFAULT_QTY = 1;

const ConnectedNewOrderDialog = ({
  restaurantId,
  open,
  onOpenChange,
  labels
}: ConnectedNewOrderDialogProps): React.JSX.Element => {
  const dishesQuery = useDishes(restaurantId);
  const menusQuery = useMenus(restaurantId);
  const clientsQuery = useClients(restaurantId);
  const createOrder = useCreateOrder(restaurantId);

  const [clientId, setClientId] = useState<string>(NO_CLIENT_VALUE);
  const [status, setStatus] = useState<ApiOrderStatus>("pending");
  const [notes, setNotes] = useState<string>("");
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);

  const dishes = dishesQuery.data?.data ?? [];
  const menus = menusQuery.data?.data ?? [];
  const clients = clientsQuery.data?.data ?? [];

  const priceMap = useMemo(() => {
    const map = new Map<string, number>();

    for (const d of dishes) map.set(`dish:${d.id}`, d.priceCents);
    for (const m of menus) map.set(`menu:${m.id}`, m.priceCents);

    return map;
  }, [dishes, menus]);

  const totalCents = useMemo(
    () =>
      draftItems.reduce((sum, it) => {
        const cents = priceMap.get(`${it.kind}:${it.refId}`) ?? 0;

        return sum + cents * it.quantity;
      }, 0),
    [draftItems, priceMap]
  );

  const reset = (): void => {
    setClientId(NO_CLIENT_VALUE);
    setStatus("pending");
    setNotes("");
    setDraftItems([]);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset();
    onOpenChange(next);
  };

  const addItem = (): void => {
    const firstDish = dishes[0];
    const firstMenu = menus[0];
    const initial: DraftItem | null = firstDish
      ? { uid: crypto.randomUUID(), kind: "dish", refId: firstDish.id, quantity: DEFAULT_QTY }
      : firstMenu
        ? { uid: crypto.randomUUID(), kind: "menu", refId: firstMenu.id, quantity: DEFAULT_QTY }
        : null;

    if (initial) setDraftItems((prev) => [...prev, initial]);
  };

  const updateItem = (uid: string, patch: Partial<DraftItem>): void => {
    setDraftItems((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)));
  };

  const removeItem = (uid: string): void => {
    setDraftItems((prev) => prev.filter((it) => it.uid !== uid));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (draftItems.length === 0) return;

    createOrder.mutate(
      {
        clientId: clientId === NO_CLIENT_VALUE ? null : clientId,
        status,
        notes: notes.trim() || null,
        items: draftItems.map((it) => ({ kind: it.kind, refId: it.refId, quantity: it.quantity }))
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex max-h-[90vh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form
          id="connected-new-order-form"
          onSubmit={handleSubmit}
          className="gap-sm flex min-h-0 flex-1 flex-col overflow-auto"
        >
          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-new-order-client">{labels.clientLabel}</Label>
            <Select value={clientId} onValueChange={(v) => { if (v !== null) setClientId(v); }}>
              <SelectTrigger id="connected-new-order-client" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CLIENT_VALUE}>{labels.clientNone}</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="gap-xs flex flex-col">
            <div className="flex items-center justify-between">
              <Label>{labels.itemsLabel}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                {labels.addItem}
              </Button>
            </div>

            {draftItems.length === 0 ? (
              <p className="text-muted-foreground typo-caption">{labels.emptyItems}</p>
            ) : (
              <div className="gap-xs flex flex-col">
                {draftItems.map((it) => {
                  const refValue = `${it.kind}:${it.refId}`;

                  return (
                    <div key={it.uid} className="gap-xs flex items-center">
                      <Select
                        value={refValue}
                        onValueChange={(v) => {
                          if (!v) return;
                          const [kind, refId] = v.split(":") as ["menu" | "dish", string];

                          updateItem(it.uid, { kind, refId });
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {menus.map((m) => (
                            <SelectItem key={`menu:${m.id}`} value={`menu:${m.id}`}>
                              {m.name} ({(m.priceCents / CENTS_PER_EURO).toFixed(2)} €)
                            </SelectItem>
                          ))}
                          {dishes.map((d) => (
                            <SelectItem key={`dish:${d.id}`} value={`dish:${d.id}`}>
                              {d.name} ({(d.priceCents / CENTS_PER_EURO).toFixed(2)} €)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={1}
                        className="w-20"
                        value={it.quantity}
                        onChange={(e) => updateItem(it.uid, { quantity: Math.max(1, Number(e.target.value)) })}
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(it.uid)}>
                        ×
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-new-order-notes">{labels.notesLabel}</Label>
            <Input
              id="connected-new-order-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-new-order-status">{labels.statusLabel}</Label>
            <Select
              value={status}
              onValueChange={(v) => { if (v !== null) setStatus(v as ApiOrderStatus); }}
            >
              <SelectTrigger id="connected-new-order-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{labels.statusNew}</SelectItem>
                <SelectItem value="preparing">{labels.statusPreparing}</SelectItem>
                <SelectItem value="ready">{labels.statusReady}</SelectItem>
                <SelectItem value="served">{labels.statusServed}</SelectItem>
                <SelectItem value="paid">{labels.statusPaid}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-foreground/10 flex items-center justify-between border-t pt-2">
            <span className="typo-overline text-muted-foreground">{labels.totalLabel}</span>
            <span className="typo-body-sm tabular-nums">
              {(totalCents / CENTS_PER_EURO).toFixed(2)} €
            </span>
          </div>
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {labels.cancel}
          </DialogClose>
          <Button
            type="submit"
            form="connected-new-order-form"
            disabled={draftItems.length === 0 || createOrder.isPending}
          >
            {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConnectedNewOrderDialog };
