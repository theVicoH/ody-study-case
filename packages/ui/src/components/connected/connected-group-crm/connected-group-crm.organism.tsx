import React, { useMemo } from "react";

import { useClientsMulti, useOrdersMulti } from "@workspace/client";
import { SheetCrm } from "@workspace/ui/components/organisms/sheet-crm/sheet-crm.organism";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

import type { ApiClient, ApiOrder, RestaurantCustomer } from "@workspace/client";
import type { ComponentProps } from "react";

const CENTS_PER_EURO = 100;

type SheetCrmLabels = ComponentProps<typeof SheetCrm>["labels"];

interface ConnectedGroupCrmProps {
  restaurantIds: ReadonlyArray<string>;
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

const ConnectedGroupCrm = ({ restaurantIds, labels }: ConnectedGroupCrmProps): React.JSX.Element => {
  const clients = useClientsMulti(restaurantIds);
  const orders = useOrdersMulti(restaurantIds);

  const customers = useMemo(
    () => buildCustomers(clients.flat, orders.flat),
    [clients.flat, orders.flat]
  );

  const vipCount = useMemo(() => customers.filter((c) => c.tag === "VIP").length, [customers]);

  const newThisMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return clients.flat.filter((c) => {
      const d = new Date(c.createdAt);

      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [clients.flat]);

  if (clients.isLoading || orders.isLoading) {
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
    <SheetCrm
      labels={labels}
      customers={customers}
      totalCustomers={customers.length}
      vipCount={vipCount}
      newThisMonth={newThisMonth}
    />
  );
};

export { ConnectedGroupCrm };
