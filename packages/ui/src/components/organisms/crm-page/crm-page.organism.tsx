import React, { useMemo } from "react";

import type { DataTableColumn, DataTableLabels } from "@/components/molecules/data-table/data-table.molecule";

import { DataTable } from "@/components/molecules/data-table/data-table.molecule";

export interface CrmClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  ordersCount?: number;
  totalSpentCents?: number;
}

export interface CrmPageLabels extends DataTableLabels {
  search: string;
  columnName: string;
  columnEmail: string;
  columnPhone: string;
  columnOrders: string;
  columnTotal: string;
}

interface CrmPageProps {
  clients: ReadonlyArray<CrmClient>;
  labels: CrmPageLabels;
  searchQuery?: string;
}

const formatPrice = (cents?: number): string => {
  if (cents === undefined) return "—";

  return `${(cents / 100).toFixed(2)} €`;
};

const CrmPage = ({ clients, labels, searchQuery }: CrmPageProps): React.JSX.Element => {
  const columns = useMemo<ReadonlyArray<DataTableColumn<CrmClient>>>(
    () => [
      {
        id: "name",
        header: labels.columnName,
        cell: (c) => `${c.firstName} ${c.lastName}`,
        sort: { getValue: (c) => `${c.lastName} ${c.firstName}` }
      },
      {
        id: "email",
        header: labels.columnEmail,
        cell: (c) => c.email ?? "—"
      },
      {
        id: "phone",
        header: labels.columnPhone,
        cell: (c) => c.phone ?? "—"
      },
      {
        id: "orders",
        header: labels.columnOrders,
        cell: (c) => c.ordersCount ?? 0,
        sort: { getValue: (c) => c.ordersCount ?? 0 }
      },
      {
        id: "total",
        header: labels.columnTotal,
        cell: (c) => formatPrice(c.totalSpentCents),
        sort: { getValue: (c) => c.totalSpentCents ?? 0 }
      }
    ],
    [labels]
  );

  return (
    <DataTable<CrmClient>
      data={clients}
      columns={columns}
      rowKey={(c) => c.id}
      labels={labels}
      searchQuery={searchQuery}
      getSearchableText={(c) => `${c.firstName} ${c.lastName} ${c.email ?? ""} ${c.phone ?? ""}`}
    />
  );
};

export { CrmPage };
