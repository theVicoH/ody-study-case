import React, { useMemo, useState } from "react";

import { useClients, useCreateClient, useCreateOrder, useDishes, useMenus } from "@workspace/client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CENTS_PER_EURO = 100;
const DEFAULT_QTY = 1;
const STEP_COUNT = 3;

interface ClientRowProps {
  selected: boolean;
  onSelect: () => void;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}

const ClientRow = ({ selected, onSelect, primary, secondary }: ClientRowProps): React.JSX.Element => (
  <TableRow
    data-state={selected ? "selected" : undefined}
    onClick={onSelect}
    className={`cursor-pointer transition-colors ${selected ? "bg-primary/15 hover:bg-primary/20" : ""}`}
  >
    <TableCell className="w-8">
      <span
        aria-hidden
        className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {selected && <span className="bg-primary-foreground size-1.5 rounded-full" />}
      </span>
    </TableCell>
    <TableCell>{primary}</TableCell>
    <TableCell className="text-muted-foreground typo-caption">{secondary}</TableCell>
  </TableRow>
);

type ClientMode = "existing" | "new";
type Step = 1 | 2 | 3;

export interface ConnectedNewOrderDialogLabels {
  title: string;
  description: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  stepProgress: string;
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
  itemsLabel: string;
  emptyItems: string;
  addItem: string;
  itemPlaceholder: string;
  itemSearchPlaceholder: string;
  itemEmpty: string;
  clientSearchPlaceholder: string;
  clientEmpty: string;
  removeItem: string;
  totalLabel: string;
  statusLabel: string;
  statusPending: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  statusPaid: string;
  cancel: string;
  submit: string;
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
  const createClient = useCreateClient(restaurantId);

  const [step, setStep] = useState<Step>(1);
  const [clientMode, setClientMode] = useState<ClientMode>("existing");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientQuery, setClientQuery] = useState<string>("");
  const [newClientFirstName, setNewClientFirstName] = useState<string>("");
  const [newClientLastName, setNewClientLastName] = useState<string>("");
  const [newClientEmail, setNewClientEmail] = useState<string>("");
  const [newClientPhone, setNewClientPhone] = useState<string>("");
  const [catalogQuery, setCatalogQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);

  const dishes = dishesQuery.data?.data ?? [];
  const menus = menusQuery.data?.data ?? [];
  const clients = clientsQuery.data?.data ?? [];

  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();

    if (!q) return clients;

    return clients.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase().includes(q));
  }, [clients, clientQuery]);

  type CatalogEntry = { kind: "menu" | "dish"; id: string; name: string; priceCents: number };

  const catalog = useMemo<ReadonlyArray<CatalogEntry>>(
    () => [
      ...menus.map<CatalogEntry>((m) => ({ kind: "menu", id: m.id, name: m.name, priceCents: m.priceCents })),
      ...dishes.map<CatalogEntry>((d) => ({ kind: "dish", id: d.id, name: d.name, priceCents: d.priceCents }))
    ],
    [dishes, menus]
  );

  const filteredCatalog = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();

    if (!q) return catalog;

    return catalog.filter((c) => c.name.toLowerCase().includes(q));
  }, [catalog, catalogQuery]);

  const priceMap = useMemo(() => {
    const map = new Map<string, number>();

    for (const c of catalog) map.set(`${c.kind}:${c.id}`, c.priceCents);

    return map;
  }, [catalog]);

  const nameMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const c of catalog) map.set(`${c.kind}:${c.id}`, c.name);

    return map;
  }, [catalog]);

  const totalCents = useMemo(
    () =>
      draftItems.reduce((sum, it) => {
        const cents = priceMap.get(`${it.kind}:${it.refId}`) ?? 0;

        return sum + cents * it.quantity;
      }, 0),
    [draftItems, priceMap]
  );

  const selectedClient = clientId ? clients.find((c) => c.id === clientId) ?? null : null;

  const reset = (): void => {
    setStep(1);
    setClientMode("existing");
    setClientId(null);
    setClientQuery("");
    setNewClientFirstName("");
    setNewClientLastName("");
    setNewClientEmail("");
    setNewClientPhone("");
    setCatalogQuery("");
    setNotes("");
    setDraftItems([]);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset();
    onOpenChange(next);
  };

  const addCatalogEntry = (entry: CatalogEntry): void => {
    setDraftItems((prev) => {
      const existing = prev.find((it) => it.kind === entry.kind && it.refId === entry.id);

      if (existing) {
        return prev.map((it) =>
          it.uid === existing.uid ? { ...it, quantity: it.quantity + 1 } : it);
      }

      return [
        ...prev,
        { uid: crypto.randomUUID(), kind: entry.kind, refId: entry.id, quantity: DEFAULT_QTY }
      ];
    });
  };

  const updateItem = (uid: string, patch: Partial<DraftItem>): void => {
    setDraftItems((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)));
  };

  const removeItem = (uid: string): void => {
    setDraftItems((prev) => prev.filter((it) => it.uid !== uid));
  };

  const draftQtyByRef = useMemo(() => {
    const map = new Map<string, number>();

    for (const it of draftItems) map.set(`${it.kind}:${it.refId}`, it.quantity);

    return map;
  }, [draftItems]);

  const submitOrder = (resolvedClientId: string | null): void => {
    createOrder.mutate(
      {
        clientId: resolvedClientId,
        status: "pending",
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (draftItems.length === 0) return;

    if (clientMode === "new") {
      const firstName = newClientFirstName.trim();
      const lastName = newClientLastName.trim();

      if (!firstName || !lastName) return;

      createClient.mutate(
        {
          firstName,
          lastName,
          email: newClientEmail.trim() || null,
          phone: newClientPhone.trim() || null
        },
        {
          onSuccess: (created) => {
            submitOrder(created.id);
          }
        }
      );

      return;
    }

    submitOrder(clientId);
  };

  const isSubmitting = createOrder.isPending || createClient.isPending;
  const newClientInvalid =
    clientMode === "new" && (!newClientFirstName.trim() || !newClientLastName.trim());
  const step1CanProceed = clientMode === "existing" || !newClientInvalid;
  const step2CanProceed = draftItems.length > 0;

  const stepTitle =
    step === 1 ? labels.step1Title : step === 2 ? labels.step2Title : labels.step3Title;
  const stepProgress = labels.stepProgress
    .replace("{{current}}", String(step))
    .replace("{{total}}", String(STEP_COUNT));

  const goNext = (): void => {
    if (step === 1 && !step1CanProceed) return;
    if (step === 2 && !step2CanProceed) return;
    setStep((prev) => (prev < STEP_COUNT ? ((prev + 1) as Step) : prev));
  };

  const goBack = (): void => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex max-h-[90vh] w-[34rem] flex-col overflow-hidden md:w-[44rem] lg:w-[52rem]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>{labels.title}</DialogTitle>
            <span className="typo-caption text-muted-foreground">{stepProgress}</span>
          </div>
          <DialogDescription>{stepTitle}</DialogDescription>
          <div className="bg-muted/40 mt-2 flex h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${(step / STEP_COUNT) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <form
          id="connected-new-order-form"
          onSubmit={handleSubmit}
          className="gap-sm scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-auto"
        >
          {step === 1 && (
            <Tabs
              value={clientMode}
              onValueChange={(v) => {
                if (v) {
                  setClientMode(v as ClientMode);
                  setClientId(null);
                }
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="existing">{labels.clientModeExisting}</TabsTrigger>
                <TabsTrigger value="new">{labels.clientModeNew}</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="gap-sm flex flex-col">
                <Input
                  value={clientQuery}
                  onChange={(e) => setClientQuery(e.target.value)}
                  placeholder={labels.clientSearchPlaceholder}
                />
                <div className="border-border scrollbar-hidden max-h-72 overflow-y-auto rounded-md border">
                  <Table>
                    <TableBody>
                      <ClientRow
                        selected={clientId === null}
                        onSelect={() => setClientId(null)}
                        primary={<span className="text-muted-foreground italic">{labels.clientNone}</span>}
                      />
                      {filteredClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground py-6 text-center">
                            {labels.clientEmpty}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClients.map((c) => (
                          <ClientRow
                            key={c.id}
                            selected={clientId === c.id}
                            onSelect={() => setClientId(c.id)}
                            primary={<span className="font-medium">{c.firstName} {c.lastName}</span>}
                            secondary={c.email ?? c.phone ?? ""}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="new" className="gap-xs flex flex-col">
                <div className="gap-xs grid grid-cols-2">
                  <div className="gap-2xs flex flex-col">
                    <Label htmlFor="new-client-first-name" className="text-xs">
                      {labels.clientFirstNameLabel}
                    </Label>
                    <Input
                      id="new-client-first-name"
                      value={newClientFirstName}
                      onChange={(e) => setNewClientFirstName(e.target.value)}
                      placeholder={labels.clientFirstNamePlaceholder}
                    />
                  </div>
                  <div className="gap-2xs flex flex-col">
                    <Label htmlFor="new-client-last-name" className="text-xs">
                      {labels.clientLastNameLabel}
                    </Label>
                    <Input
                      id="new-client-last-name"
                      value={newClientLastName}
                      onChange={(e) => setNewClientLastName(e.target.value)}
                      placeholder={labels.clientLastNamePlaceholder}
                    />
                  </div>
                </div>
                <div className="gap-2xs flex flex-col">
                  <Label htmlFor="new-client-email" className="text-xs">
                    {labels.clientEmailLabel}
                  </Label>
                  <Input
                    id="new-client-email"
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder={labels.clientEmailPlaceholder}
                  />
                </div>
                <div className="gap-2xs flex flex-col">
                  <Label htmlFor="new-client-phone" className="text-xs">
                    {labels.clientPhoneLabel}
                  </Label>
                  <Input
                    id="new-client-phone"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder={labels.clientPhonePlaceholder}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {step === 2 && (
            <div className="gap-sm flex flex-col">
              <Input
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                placeholder={labels.itemSearchPlaceholder}
              />
              <div className="border-border scrollbar-hidden max-h-64 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{labels.catalogColName}</TableHead>
                      <TableHead className="text-end">{labels.catalogColPrice}</TableHead>
                      <TableHead className="w-12 text-end">{labels.catalogColAdd}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCatalog.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-muted-foreground py-6 text-center">
                          {labels.itemEmpty}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCatalog.map((entry) => {
                        const inDraft = draftQtyByRef.get(`${entry.kind}:${entry.id}`) ?? 0;

                        return (
                          <TableRow
                            key={`${entry.kind}:${entry.id}`}
                            onClick={() => addCatalogEntry(entry)}
                            className="cursor-pointer"
                          >
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{entry.name}</span>
                                <span className="text-muted-foreground typo-caption">
                                  {entry.kind === "menu" ? labels.catalogTypeMenu : labels.catalogTypeDish}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-end tabular-nums">
                              {(entry.priceCents / CENTS_PER_EURO).toFixed(2)} €
                            </TableCell>
                            <TableCell className="text-end">
                              <Button
                                type="button"
                                size="sm"
                                variant={inDraft > 0 ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addCatalogEntry(entry);
                                }}
                              >
                                {inDraft > 0 ? `× ${inDraft}` : labels.catalogAdd}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="gap-xs flex flex-col">
                <Label>{labels.selectedItemsLabel}</Label>
                {draftItems.length === 0 ? (
                  <p className="text-muted-foreground typo-caption">{labels.emptyItems}</p>
                ) : (
                  <div className="gap-2xs flex flex-col">
                    {draftItems.map((it) => {
                      const refKey = `${it.kind}:${it.refId}`;
                      const name = nameMap.get(refKey) ?? "";
                      const lineCents = (priceMap.get(refKey) ?? 0) * it.quantity;

                      return (
                        <div
                          key={it.uid}
                          className="bg-muted/30 gap-xs flex items-center rounded-md p-2"
                        >
                          <span className="line-clamp-1 flex-1 text-sm">{name}</span>
                          <Input
                            type="number"
                            min={1}
                            className="h-7 w-16"
                            value={it.quantity}
                            onChange={(e) =>
                              updateItem(it.uid, { quantity: Math.max(1, Number(e.target.value)) })
                            }
                          />
                          <span className="typo-caption text-muted-foreground w-16 text-end tabular-nums">
                            {(lineCents / CENTS_PER_EURO).toFixed(2)} €
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(it.uid)}
                            aria-label={labels.removeItem}
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="gap-sm flex flex-col">
              <div className="gap-2xs flex flex-col">
                <span className="typo-caption text-muted-foreground">{labels.summaryClient}</span>
                <span className="text-sm">
                  {clientMode === "new"
                    ? `${newClientFirstName.trim()} ${newClientLastName.trim()}`
                    : selectedClient
                      ? `${selectedClient.firstName} ${selectedClient.lastName}`
                      : labels.clientNone}
                </span>
              </div>

              <div className="gap-2xs flex flex-col">
                <span className="typo-caption text-muted-foreground">{labels.summaryItems}</span>
                <div className="border-border overflow-hidden rounded-md border">
                  <Table>
                    <TableBody>
                      {draftItems.map((it) => {
                        const refKey = `${it.kind}:${it.refId}`;
                        const name = nameMap.get(refKey) ?? "";
                        const lineCents = (priceMap.get(refKey) ?? 0) * it.quantity;

                        return (
                          <TableRow key={it.uid}>
                            <TableCell>{name}</TableCell>
                            <TableCell className="text-muted-foreground w-12 text-end tabular-nums">
                              × {it.quantity}
                            </TableCell>
                            <TableCell className="w-20 text-end tabular-nums">
                              {(lineCents / CENTS_PER_EURO).toFixed(2)} €
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="gap-xs flex flex-col">
                <Label htmlFor="connected-new-order-notes">{labels.notesLabel}</Label>
                <Input
                  id="connected-new-order-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={labels.notesPlaceholder}
                />
              </div>

              <div className="border-foreground/10 flex items-center justify-between border-t pt-2">
                <span className="typo-overline text-muted-foreground">{labels.totalLabel}</span>
                <span className="typo-body-sm tabular-nums">
                  {(totalCents / CENTS_PER_EURO).toFixed(2)} €
                </span>
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-between gap-2">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={goBack}>
              {labels.back}
            </Button>
          ) : (
            <DialogClose render={<Button type="button" variant="ghost" />}>
              {labels.cancel}
            </DialogClose>
          )}

          <div className="gap-xs flex">
            {step < STEP_COUNT ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={(step === 1 && !step1CanProceed) || (step === 2 && !step2CanProceed)}
              >
                {labels.next}
              </Button>
            ) : (
              <Button
                type="submit"
                form="connected-new-order-form"
                disabled={isSubmitting || draftItems.length === 0}
              >
                {labels.submit}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConnectedNewOrderDialog };
