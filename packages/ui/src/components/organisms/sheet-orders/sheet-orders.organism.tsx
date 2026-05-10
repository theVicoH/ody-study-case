import React, { useMemo, useState } from "react";


import type { NewOrderDialogLabels, NewOrderFormValues } from "@/components/organisms/new-order-dialog/new-order-dialog.organism";
import type { RestaurantOrder } from "@workspace/client";

import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { NewOrderDialog } from "@/components/organisms/new-order-dialog/new-order-dialog.organism";
import { OrdersTable } from "@/components/organisms/orders-table/orders-table.organism";
import { Button } from "@/components/ui/button";



interface SheetOrdersLabels {
  searchPlaceholder: string;
  newOrder: string;
  filterAll: string;
  filterNew: string;
  filterPreparing: string;
  filterReady: string;
  filterServed: string;
  filterPaid: string;
  statusNew: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  statusPaid: string;
  itemsWord: string;
  emptyFilter: string;
  colTable: string;
  colOrder: string;
  colItems: string;
  colTotal: string;
  colStatus: string;
  colTime: string;
  paginationPrev: string;
  paginationNext: string;
  newOrderDialog: NewOrderDialogLabels;
}

const PERCENT_MULTIPLIER = 100;
const ICON_SIZE = 16;

interface SheetOrdersProps {
  labels: SheetOrdersLabels;
  orders: ReadonlyArray<RestaurantOrder>;
  onCreateOrder?: (values: NewOrderFormValues) => void;
  onStatusChange?: (orderId: string, status: RestaurantOrder["status"]) => void;
  renderCreateDialog?: (props: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
}

const SheetOrders = ({
  labels,
  orders,
  onCreateOrder,
  onStatusChange,
  renderCreateDialog
}: SheetOrdersProps): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localOrders, setLocalOrders] = useState<ReadonlyArray<RestaurantOrder>>([]);

  const statusCounts = useMemo(() => ({
    new: orders.filter((o) => o.status === "new").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length
  }), [orders]);

  const totalTrackedOrders = statusCounts.new + statusCounts.preparing + statusCounts.ready;
  const formatShare = (count: number): string =>
    totalTrackedOrders === 0 ? "0%" : `${Math.round((count / totalTrackedOrders) * PERCENT_MULTIPLIER)}%`;

  const allOrders = useMemo(
    () => [...localOrders, ...orders],
    [localOrders, orders]
  );

  const searchedOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return allOrders;

    return allOrders.filter((o) => o.id.toLowerCase().includes(q));
  }, [allOrders, search]);

  const handleSubmit = (values: NewOrderFormValues): void => {
    const newOrder: RestaurantOrder = {
      id: `local-${Date.now()}`,
      table: values.table,
      items: values.items,
      total: values.total,
      status: values.status,
      when: new Date().toISOString()
    };

    setLocalOrders((prev) => [newOrder, ...prev]);
    onCreateOrder?.(values);
  };

  const tableLabels = {
    colTable: labels.colTable,
    colOrder: labels.colOrder,
    colItems: labels.colItems,
    colTotal: labels.colTotal,
    colStatus: labels.colStatus,
    colTime: labels.colTime,
    itemsWord: labels.itemsWord,
    empty: labels.emptyFilter,
    previous: labels.paginationPrev,
    next: labels.paginationNext,
    filterAll: labels.filterAll,
    statusNew: labels.statusNew,
    statusPreparing: labels.statusPreparing,
    statusReady: labels.statusReady,
    statusServed: labels.statusServed,
    statusPaid: labels.statusPaid
  };

  return (
    <>
      <div className="gap-sm grid shrink-0 grid-cols-3">
        <KpiCard
          variant="subtle"
          label={labels.filterNew}
          value={statusCounts.new}
          trend={formatShare(statusCounts.new)}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.filterPreparing}
          value={statusCounts.preparing}
          trend={formatShare(statusCounts.preparing)}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.filterReady}
          value={statusCounts.ready}
          trend={formatShare(statusCounts.ready)}
          trendDirection="up"
        />
      </div>

      <div className="gap-sm flex shrink-0 items-center">
        <SearchInput
          className="flex-1"
          placeholder={labels.searchPlaceholder}
          value={search}
          onChange={setSearch}
        />
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <PlusIcon size={ICON_SIZE} data-icon="inline-start" />
          {labels.newOrder}
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <OrdersTable orders={searchedOrders} labels={tableLabels} onStatusChange={onStatusChange} />
      </div>

      {renderCreateDialog ? (
        renderCreateDialog({ open: dialogOpen, onOpenChange: setDialogOpen })
      ) : (
        <NewOrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          labels={labels.newOrderDialog}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export { SheetOrders };

export type { SheetOrdersProps, SheetOrdersLabels };
