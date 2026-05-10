import React, { useMemo, useState } from "react";
import type { ComponentProps } from "react";

import { useClientsMulti, useCreateClient, useOrdersMulti } from "@workspace/client";
import { SheetCrm } from "@workspace/ui/components/organisms/sheet-crm/sheet-crm.organism";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

import type { ApiClient, ApiOrder, RestaurantCustomer } from "@workspace/client";
import type { NewCustomerFormValues } from "@workspace/ui/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import type { RestaurantPickerDialogLabels, RestaurantPickerOption } from "@workspace/ui/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";

import { NewCustomerDialog } from "@/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import { RestaurantPickerDialog } from "@/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";

const CENTS_PER_EURO = 100;

type SheetCrmLabels = ComponentProps<typeof SheetCrm>["labels"];

interface ConnectedGroupCrmProps {
  restaurantIds: ReadonlyArray<string>;
  restaurants: ReadonlyArray<RestaurantPickerOption>;
  labels: SheetCrmLabels;
  pickerLabels: RestaurantPickerDialogLabels;
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

interface CreateForRestaurantProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: SheetCrmLabels["newCustomerDialog"];
}

const CreateForRestaurant = ({
  restaurantId,
  open,
  onOpenChange,
  labels
}: CreateForRestaurantProps): React.JSX.Element => {
  const createMutation = useCreateClient(restaurantId);

  const handleSubmit = (values: NewCustomerFormValues): void => {
    createMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email === "" ? null : values.email
    });
    onOpenChange(false);
  };

  return (
    <NewCustomerDialog
      open={open}
      onOpenChange={onOpenChange}
      labels={labels}
      onSubmit={handleSubmit}
    />
  );
};

const ConnectedGroupCrm = ({
  restaurantIds,
  restaurants,
  labels,
  pickerLabels
}: ConnectedGroupCrmProps): React.JSX.Element => {
  const clients = useClientsMulti(restaurantIds);
  const orders = useOrdersMulti(restaurantIds);
  const [pickedId, setPickedId] = useState<string | null>(null);

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
      renderCreateDialog={({ open, onOpenChange }) => {
        const handleClose = (next: boolean): void => {
          onOpenChange(next);
          if (!next) setPickedId(null);
        };

        if (pickedId) {
          return (
            <CreateForRestaurant
              restaurantId={pickedId}
              open={open}
              onOpenChange={handleClose}
              labels={labels.newCustomerDialog}
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

export { ConnectedGroupCrm };
