import React, { useMemo, useState } from "react";
import type { ComponentProps } from "react";

import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useOrders,
  useUpdateClient
} from "@workspace/client";
import { SheetCrm } from "@workspace/ui/components/organisms/sheet-crm/sheet-crm.organism";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

import type { ApiClient, ApiOrder, RestaurantCustomer } from "@workspace/client";
import type { NewCustomerFormValues } from "@workspace/ui/components/organisms/new-customer-dialog/new-customer-dialog.organism";

const CENTS_PER_EURO = 100;
const PAGE_SIZE = 20;

type SheetCrmLabels = ComponentProps<typeof SheetCrm>["labels"];

interface ConnectedCrmProps {
  restaurantId: string;
  labels: SheetCrmLabels;
}

const buildCustomers = (
  clients: ReadonlyArray<ApiClient>,
  orders: ReadonlyArray<ApiOrder>
): RestaurantCustomer[] => {
  const stats = new Map<string, { visits: number; spentCents: number }>();

  for (const order of orders) {
    if (!order.clientId) continue;
    const cur = stats.get(order.clientId) ?? { visits: 0, spentCents: 0 };

    cur.visits += 1;
    cur.spentCents += order.totalCents;
    stats.set(order.clientId, cur);
  }

  return clients.map((c) => {
    const s = stats.get(c.id) ?? { visits: 0, spentCents: 0 };

    return {
      id: c.id,
      name: `${c.firstName} ${c.lastName}`.trim(),
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email ?? "",
      visits: s.visits,
      spent: s.spentCents / CENTS_PER_EURO,
      tag: c.tag
    };
  });
};

const CrmSkeleton = (): React.JSX.Element => (
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

const ConnectedCrm = ({ restaurantId, labels }: ConnectedCrmProps): React.JSX.Element => {
  const [page, setPage] = useState(1);
  const clientsQuery = useClients(restaurantId, page, PAGE_SIZE);
  const ordersQuery = useOrders(restaurantId);
  const createMutation = useCreateClient(restaurantId);
  const updateMutation = useUpdateClient(restaurantId);
  const deleteMutation = useDeleteClient(restaurantId);

  const customers = useMemo(
    () => buildCustomers(clientsQuery.data?.data ?? [], ordersQuery.data?.data ?? []),
    [clientsQuery.data, ordersQuery.data]
  );

  const totalCustomers = clientsQuery.data?.total ?? customers.length;
  const totalPages = clientsQuery.data?.totalPages ?? 1;
  const vipCount = useMemo(() => customers.filter((c) => c.tag === "VIP").length, [customers]);

  const newThisMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return (clientsQuery.data?.data ?? []).filter((c) => {
      const d = new Date(c.createdAt);

      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [clientsQuery.data]);

  const handleCreate = (values: NewCustomerFormValues): void => {
    createMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email === "" ? null : values.email
    });
  };

  const handleUpdate = (id: string, values: NewCustomerFormValues): void => {
    updateMutation.mutate({
      id,
      input: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email === "" ? null : values.email,
        tag: values.tag
      }
    });
  };

  const handleDelete = (id: string): void => {
    deleteMutation.mutate(id);
  };

  if (clientsQuery.isPending || ordersQuery.isPending) return <CrmSkeleton />;

  return (
    <SheetCrm
      labels={labels}
      customers={customers}
      totalCustomers={totalCustomers}
      vipCount={vipCount}
      newThisMonth={newThisMonth}
      pageSize={PAGE_SIZE}
      serverPagination={{ page, totalPages, onPageChange: setPage }}
      onCreateCustomer={handleCreate}
      onUpdateCustomer={handleUpdate}
      onDeleteCustomer={handleDelete}
    />
  );
};

export { ConnectedCrm };
