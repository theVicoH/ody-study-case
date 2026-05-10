import React, { useMemo } from "react";

import type { DataTableColumn, DataTableLabels } from "@/components/molecules/data-table/data-table.molecule";

import { DataTable } from "@/components/molecules/data-table/data-table.molecule";

export type OrderRowStatus = "pending" | "preparing" | "ready" | "served" | "paid" | "cancelled";

export interface OrderRow {
  id: string;
  clientName: string | null;
  status: OrderRowStatus;
  itemCount: number;
  totalCents: number;
  placedAt: string;
}

export interface OrdersPageLabels extends DataTableLabels {
  search: string;
  columnReference: string;
  columnClient: string;
  columnStatus: string;
  columnItems: string;
  columnTotal: string;
  columnDate: string;
  statusLabels: Record<OrderRowStatus, string>;
}

interface OrdersPageProps {
  orders: ReadonlyArray<OrderRow>;
  labels: OrdersPageLabels;
  searchQuery?: string;
}

const CENTS_PER_EURO = 100;

const formatPrice = (cents: number): string => `${(cents / CENTS_PER_EURO).toFixed(2)} €`;

const formatDate = (iso: string): string => new Date(iso).toLocaleString();

const OrdersPage = ({ orders, labels, searchQuery }: OrdersPageProps): React.JSX.Element => {
  const columns = useMemo<ReadonlyArray<DataTableColumn<OrderRow>>>(
    () => [
      {
        id: "ref",
        header: labels.columnReference,
        cell: (o) => o.id.slice(0, 8)
      },
      {
        id: "client",
        header: labels.columnClient,
        cell: (o) => o.clientName ?? "—"
      },
      {
        id: "status",
        header: labels.columnStatus,
        cell: (o) => labels.statusLabels[o.status],
        filter: {
          getValue: (o) => o.status,
          options: (Object.entries(labels.statusLabels) as Array<[OrderRowStatus, string]>).map(([value, label]) => ({
            value,
            label
          }))
        }
      },
      {
        id: "items",
        header: labels.columnItems,
        cell: (o) => o.itemCount,
        sort: { getValue: (o) => o.itemCount }
      },
      {
        id: "total",
        header: labels.columnTotal,
        cell: (o) => formatPrice(o.totalCents),
        sort: { getValue: (o) => o.totalCents }
      },
      {
        id: "date",
        header: labels.columnDate,
        cell: (o) => formatDate(o.placedAt),
        sort: { getValue: (o) => o.placedAt }
      }
    ],
    [labels]
  );

  return (
    <DataTable<OrderRow>
      data={orders}
      columns={columns}
      rowKey={(o) => o.id}
      labels={labels}
      searchQuery={searchQuery}
      getSearchableText={(o) => `${o.id} ${o.clientName ?? ""} ${o.status}`}
    />
  );
};

export { OrdersPage };
