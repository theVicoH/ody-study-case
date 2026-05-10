import React, { useMemo } from "react";

import type { DataTableColumn } from "@/components/molecules/data-table/data-table.molecule";
import type { RestaurantOrder } from "@workspace/client";

import { DataTable } from "@/components/molecules/data-table/data-table.molecule";
import { Badge } from "@/components/ui/badge";



type OrderStatus = RestaurantOrder["status"];

const STATUS_BADGE_VARIANTS: Record<OrderStatus, "default" | "warning" | "info" | "success" | "outline"> = {
  new: "default",
  preparing: "warning",
  ready: "info",
  served: "success",
  paid: "outline"
};

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

const parseRelativeTime = (when: string): number => {
  const trimmed = when.trim().toLowerCase();

  if (trimmed === "just now" || trimmed === "à l'instant") return 0;

  const match = /^(\d+)\s*([smhd])$/.exec(trimmed);

  if (!match) return Number.MAX_SAFE_INTEGER;

  const n = Number(match[1]);
  const unit = match[2];

  if (unit === "s") return n;
  if (unit === "m") return n * SECONDS_PER_MINUTE;
  if (unit === "h") return n * SECONDS_PER_HOUR;

  return n * SECONDS_PER_DAY;
};

interface OrdersTableLabels {
  colTable: string;
  colOrder: string;
  colItems: string;
  colTotal: string;
  colStatus: string;
  colTime: string;
  itemsWord: string;
  empty: string;
  previous: string;
  next: string;
  filterAll: string;
  statusNew: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  statusPaid: string;
}

interface OrdersTableProps {
  orders: ReadonlyArray<RestaurantOrder>;
  labels: OrdersTableLabels;
  pageSize?: number;
  className?: string;
}

const OrdersTable = ({ orders, labels, pageSize, className }: OrdersTableProps): React.JSX.Element => {
  const statusLabels: Record<OrderStatus, string> = {
    new: labels.statusNew,
    preparing: labels.statusPreparing,
    ready: labels.statusReady,
    served: labels.statusServed,
    paid: labels.statusPaid
  };

  const tableOptions = useMemo(() => {
    const seen = new Set<number>();
    const result: Array<{ label: string; value: string }> = [];

    orders.forEach((o) => {
      if (!seen.has(o.table)) {
        seen.add(o.table);
        result.push({ label: `T${o.table}`, value: String(o.table) });
      }
    });

    return result.sort((a, b) => Number(a.value) - Number(b.value));
  }, [orders]);

  const columns: ReadonlyArray<DataTableColumn<RestaurantOrder>> = [
    {
      id: "table",
      header: labels.colTable,
      align: "start",
      className: "w-12",
      cell: (o) => (
        <div className="border-border bg-muted typo-caption size-xl inline-flex items-center justify-center rounded-md border text-[10px]">
          T{o.table}
        </div>
      ),
      filter: {
        getValue: (o) => String(o.table),
        options: tableOptions,
        allLabel: labels.filterAll
      }
    },
    {
      id: "order",
      header: labels.colOrder,
      align: "start",
      cell: (o) => (
        <span className="text-foreground typo-button">{o.id}</span>
      )
    },
    {
      id: "items",
      header: labels.colItems,
      align: "end",
      cell: (o) => (
        <span className="text-muted-foreground typo-caption">
          {o.items} {labels.itemsWord}
        </span>
      ),
      sort: { getValue: (o) => o.items }
    },
    {
      id: "total",
      header: labels.colTotal,
      align: "end",
      cell: (o) => (
        <span className="text-foreground typo-body-sm tabular-nums">
          €{o.total.toFixed(2)}
        </span>
      ),
      sort: { getValue: (o) => o.total }
    },
    {
      id: "status",
      header: labels.colStatus,
      align: "end",
      cell: (o) => (
        <Badge variant={STATUS_BADGE_VARIANTS[o.status]}>
          {statusLabels[o.status]}
        </Badge>
      ),
      filter: {
        getValue: (o) => o.status,
        options: [
          { label: labels.statusNew, value: "new" },
          { label: labels.statusPreparing, value: "preparing" },
          { label: labels.statusReady, value: "ready" },
          { label: labels.statusServed, value: "served" },
          { label: labels.statusPaid, value: "paid" }
        ],
        allLabel: labels.filterAll
      }
    },
    {
      id: "when",
      header: labels.colTime,
      align: "end",
      cell: (o) => (
        <span className="text-muted-foreground typo-caption">{o.when}</span>
      ),
      sort: { getValue: (o) => parseRelativeTime(o.when) }
    }
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      rowKey={(o) => o.id}
      pageSize={pageSize}
      className={className}
      labels={{
        empty: labels.empty,
        previous: labels.previous,
        next: labels.next,
        filterAll: labels.filterAll
      }}
    />
  );
};

export { OrdersTable };

export type { OrdersTableProps, OrdersTableLabels };
