import React, { useMemo } from "react";
import type { ComponentProps } from "react";

import { useOrders, useUpdateOrderStatus } from "@workspace/client";

import type { ApiOrder, ApiOrderStatus, OrderStatus, RestaurantOrder } from "@workspace/client";

import { ConnectedNewOrderDialog } from "@/components/connected/connected-new-order-dialog/connected-new-order-dialog.organism";
import { SheetOrders } from "@/components/organisms/sheet-orders/sheet-orders.organism";
import { Skeleton } from "@/components/ui/skeleton";

const CENTS_PER_EURO = 100;
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

type SheetOrdersLabels = ComponentProps<typeof SheetOrders>["labels"];

interface ConnectedOrdersProps {
  restaurantId: string;
  labels: SheetOrdersLabels;
}

const STATUS_MAP: Record<ApiOrderStatus, OrderStatus> = {
  pending: "new",
  preparing: "preparing",
  ready: "ready",
  served: "served",
  paid: "paid",
  cancelled: "paid"
};

const REVERSE_STATUS_MAP: Record<OrderStatus, ApiOrderStatus> = {
  new: "pending",
  preparing: "preparing",
  ready: "ready",
  served: "served",
  paid: "paid"
};

const formatRelative = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();

  if (diff < MINUTE_MS) return "just now";
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}m`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}h`;

  return `${Math.floor(diff / DAY_MS)}d`;
};

const tableNumberFromId = (tableId: string | null, fallback: number): number => {
  if (!tableId) return fallback;
  const HEX_BASE = 16;
  const SLICE = 4;
  const MOD = 99;
  const num = parseInt(tableId.replace(/-/g, "").slice(0, SLICE), HEX_BASE);

  return (Number.isFinite(num) ? num % MOD : fallback) + 1;
};

const buildOrders = (orders: ReadonlyArray<ApiOrder>): RestaurantOrder[] =>
  orders.map((o, idx) => ({
    id: `#${o.id.slice(0, 8)}`,
    table: tableNumberFromId(o.tableId, idx),
    items: o.items.reduce((sum, it) => sum + it.quantity, 0),
    total: o.totalCents / CENTS_PER_EURO,
    status: STATUS_MAP[o.status],
    when: formatRelative(o.placedAt)
  }));

const OrdersSkeleton = (): React.JSX.Element => (
  <>
    <div className="gap-sm grid shrink-0 grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-9 w-full shrink-0" />
    <div className="min-h-0 flex-1 space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  </>
);

const ConnectedOrders = ({ restaurantId, labels }: ConnectedOrdersProps): React.JSX.Element => {
  const ordersQuery = useOrders(restaurantId);
  const updateStatus = useUpdateOrderStatus(restaurantId);

  const orders = useMemo(() => buildOrders(ordersQuery.data?.data ?? []), [ordersQuery.data]);

  const idMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const o of ordersQuery.data?.data ?? []) {
      map.set(`#${o.id.slice(0, 8)}`, o.id);
    }

    return map;
  }, [ordersQuery.data]);

  const dialogLabels = useMemo(
    () => ({
      title: labels.newOrderDialog.title,
      description: labels.newOrderDialog.description,
      clientLabel: labels.newOrderDialog.clientLabel,
      clientNone: labels.newOrderDialog.clientNone,
      clientPlaceholder: labels.newOrderDialog.clientPlaceholder,
      clientModeExisting: labels.newOrderDialog.clientModeExisting,
      clientModeNew: labels.newOrderDialog.clientModeNew,
      clientFirstNameLabel: labels.newOrderDialog.clientFirstNameLabel,
      clientFirstNamePlaceholder: labels.newOrderDialog.clientFirstNamePlaceholder,
      clientLastNameLabel: labels.newOrderDialog.clientLastNameLabel,
      clientLastNamePlaceholder: labels.newOrderDialog.clientLastNamePlaceholder,
      clientEmailLabel: labels.newOrderDialog.clientEmailLabel,
      clientEmailPlaceholder: labels.newOrderDialog.clientEmailPlaceholder,
      clientPhoneLabel: labels.newOrderDialog.clientPhoneLabel,
      clientPhonePlaceholder: labels.newOrderDialog.clientPhonePlaceholder,
      notesLabel: labels.newOrderDialog.notesLabel,
      notesPlaceholder: labels.newOrderDialog.notesPlaceholder,
      itemsLabel: labels.newOrderDialog.itemsLabel,
      emptyItems: labels.newOrderDialog.emptyItems,
      addItem: labels.newOrderDialog.addItem,
      itemPlaceholder: labels.newOrderDialog.itemPlaceholder,
      itemSearchPlaceholder: labels.newOrderDialog.itemSearchPlaceholder,
      itemEmpty: labels.newOrderDialog.itemEmpty,
      clientSearchPlaceholder: labels.newOrderDialog.clientSearchPlaceholder,
      clientEmpty: labels.newOrderDialog.clientEmpty,
      removeItem: labels.newOrderDialog.removeItem,
      totalLabel: labels.newOrderDialog.totalLabel,
      statusLabel: labels.newOrderDialog.statusLabel,
      statusPending: labels.newOrderDialog.statusPending,
      statusPreparing: labels.newOrderDialog.statusPreparing,
      statusReady: labels.newOrderDialog.statusReady,
      statusServed: labels.newOrderDialog.statusServed,
      statusPaid: labels.newOrderDialog.statusPaid,
      cancel: labels.newOrderDialog.cancel,
      submit: labels.newOrderDialog.submit,
      step1Title: labels.newOrderDialog.step1Title,
      step2Title: labels.newOrderDialog.step2Title,
      step3Title: labels.newOrderDialog.step3Title,
      stepProgress: labels.newOrderDialog.stepProgress,
      next: labels.newOrderDialog.next,
      back: labels.newOrderDialog.back,
      selectedClient: labels.newOrderDialog.selectedClient,
      catalogLabel: labels.newOrderDialog.catalogLabel,
      catalogColName: labels.newOrderDialog.catalogColName,
      catalogColPrice: labels.newOrderDialog.catalogColPrice,
      catalogColAdd: labels.newOrderDialog.catalogColAdd,
      catalogAdd: labels.newOrderDialog.catalogAdd,
      catalogTypeMenu: labels.newOrderDialog.catalogTypeMenu,
      catalogTypeDish: labels.newOrderDialog.catalogTypeDish,
      selectedItemsLabel: labels.newOrderDialog.selectedItemsLabel,
      summaryClient: labels.newOrderDialog.summaryClient,
      summaryItems: labels.newOrderDialog.summaryItems
    }),
    [labels]
  );

  const handleStatusChange = (displayId: string, status: OrderStatus): void => {
    const fullId = idMap.get(displayId);

    if (!fullId) return;
    updateStatus.mutate({ id: fullId, status: REVERSE_STATUS_MAP[status] });
  };

  if (ordersQuery.isPending) return <OrdersSkeleton />;

  return (
    <SheetOrders
      labels={labels}
      orders={orders}
      onStatusChange={handleStatusChange}
      renderCreateDialog={({ open, onOpenChange }) => (
        <ConnectedNewOrderDialog
          restaurantId={restaurantId}
          open={open}
          onOpenChange={onOpenChange}
          labels={dialogLabels}
        />
      )}
    />
  );
};

export { ConnectedOrders };
