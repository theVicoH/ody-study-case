import React, { useMemo, useState } from "react";

import { useOrdersMulti, useUpdateOrderStatusForAny } from "@workspace/client";

import type { ApiOrder, ApiOrderStatus, OrderStatus, RestaurantOrder } from "@workspace/client";
import type { RestaurantPickerDialogLabels, RestaurantPickerOption } from "@workspace/ui/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";
import type { ComponentProps } from "react";

import { ConnectedNewOrderDialog } from "@/components/connected/connected-new-order-dialog/connected-new-order-dialog.organism";
import { RestaurantPickerDialog } from "@/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";
import { SheetOrders } from "@/components/organisms/sheet-orders/sheet-orders.organism";
import { Skeleton } from "@/components/ui/skeleton";

const CENTS_PER_EURO = 100;
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

type SheetOrdersLabels = ComponentProps<typeof SheetOrders>["labels"];
type ConnectedNewOrderDialogLabels = ComponentProps<typeof ConnectedNewOrderDialog>["labels"];

interface ConnectedGroupOrdersProps {
  restaurantIds: ReadonlyArray<string>;
  restaurants: ReadonlyArray<RestaurantPickerOption>;
  labels: SheetOrdersLabels;
  newOrderDialogLabels: ConnectedNewOrderDialogLabels;
  pickerLabels: RestaurantPickerDialogLabels;
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
  orders
    .slice()
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .map((o, idx) => ({
      id: `#${o.id.slice(0, 8)}`,
      table: tableNumberFromId(o.tableId, idx),
      items: o.items.reduce((sum, it) => sum + it.quantity, 0),
      total: o.totalCents / CENTS_PER_EURO,
      status: STATUS_MAP[o.status],
      when: formatRelative(o.placedAt)
    }));

const ConnectedGroupOrders = ({
  restaurantIds,
  restaurants,
  labels,
  newOrderDialogLabels,
  pickerLabels
}: ConnectedGroupOrdersProps): React.JSX.Element => {
  const ordersResult = useOrdersMulti(restaurantIds);
  const updateStatus = useUpdateOrderStatusForAny();
  const [pickedId, setPickedId] = useState<string | null>(null);

  const orders = useMemo(() => buildOrders(ordersResult.flat), [ordersResult.flat]);

  const idToRestaurant = useMemo(() => {
    const map = new Map<string, { fullId: string; restaurantId: string }>();

    for (const [restaurantId, list] of ordersResult.byRestaurant) {
      for (const o of list) {
        map.set(`#${o.id.slice(0, 8)}`, { fullId: o.id, restaurantId });
      }
    }

    return map;
  }, [ordersResult.byRestaurant]);

  const handleStatusChange = (displayId: string, status: OrderStatus): void => {
    const entry = idToRestaurant.get(displayId);

    if (!entry) return;
    updateStatus.mutate({
      restaurantId: entry.restaurantId,
      id: entry.fullId,
      status: REVERSE_STATUS_MAP[status]
    });
  };

  if (ordersResult.isLoading) {
    return (
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
  }

  return (
    <SheetOrders
      labels={labels}
      orders={orders}
      onStatusChange={handleStatusChange}
      renderCreateDialog={({ open, onOpenChange }) => {
        const handleClose = (next: boolean): void => {
          onOpenChange(next);
          if (!next) setPickedId(null);
        };

        if (pickedId) {
          return (
            <ConnectedNewOrderDialog
              restaurantId={pickedId}
              open={open}
              onOpenChange={handleClose}
              labels={newOrderDialogLabels}
            />
          );
        }

        return (
          <RestaurantPickerDialog
            open={open}
            onOpenChange={onOpenChange}
            labels={pickerLabels}
            restaurants={restaurants}
            onSelect={(id) => setPickedId(id)}
          />
        );
      }}
    />
  );
};

export { ConnectedGroupOrders };
