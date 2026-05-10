import React, { useMemo, useState } from "react";


import type { NewCustomerDialogLabels, NewCustomerFormValues } from "@/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import type { RestaurantCustomer } from "@workspace/client";

import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { CustomersTable } from "@/components/organisms/customers-table/customers-table.organism";
import { NewCustomerDialog } from "@/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import { Button } from "@/components/ui/button";



const VIP_PERCENT_MULTIPLIER = 100;
const ICON_SIZE = 16;

interface SheetCrmLabels {
  searchPlaceholder: string;
  newCustomer: string;
  registeredCustomers: string;
  vip: string;
  thisMonth: string;
  avgSpend: string;
  tagVip: string;
  tagRegular: string;
  tagNew: string;
  emptySearch: string;
  colCustomer: string;
  colVisits: string;
  colSpent: string;
  colTag: string;
  filterAll: string;
  paginationPrev: string;
  paginationNext: string;
  visitsWord: string;
  newCustomerDialog: NewCustomerDialogLabels;
}

interface SheetCrmProps {
  labels: SheetCrmLabels;
  customers: ReadonlyArray<RestaurantCustomer>;
  totalCustomers: number;
  vipCount: number;
  onCreateCustomer?: (values: NewCustomerFormValues) => void;
}

const SheetCrm = ({
  labels,
  customers,
  totalCustomers,
  vipCount,
  onCreateCustomer
}: SheetCrmProps): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localCustomers, setLocalCustomers] = useState<ReadonlyArray<RestaurantCustomer>>([]);

  const allCustomers = useMemo(
    () => [...localCustomers, ...customers],
    [localCustomers, customers]
  );

  const effectiveTotal = totalCustomers + localCustomers.length;
  const effectiveVip = vipCount + localCustomers.filter((c) => c.tag === "VIP").length;

  const avgSpend = useMemo(() => {
    if (allCustomers.length === 0) return 0;
    const total = allCustomers.reduce((sum, c) => sum + c.spent, 0);

    return Math.round(total / allCustomers.length);
  }, [allCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return allCustomers;

    return allCustomers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q));
  }, [allCustomers, search]);

  const tableLabels = {
    colCustomer: labels.colCustomer,
    colVisits: labels.colVisits,
    colSpent: labels.colSpent,
    colTag: labels.colTag,
    tagVip: labels.tagVip,
    tagRegular: labels.tagRegular,
    tagNew: labels.tagNew,
    empty: labels.emptySearch,
    previous: labels.paginationPrev,
    next: labels.paginationNext,
    filterAll: labels.filterAll,
    visitsWord: labels.visitsWord
  };

  const handleSubmit = (values: NewCustomerFormValues): void => {
    const newCustomer: RestaurantCustomer = {
      id: `local-${Date.now()}`,
      name: values.name,
      email: values.email,
      visits: 0,
      spent: 0,
      tag: values.tag
    };

    setLocalCustomers((prev) => [newCustomer, ...prev]);
    onCreateCustomer?.(values);
  };

  return (
    <>
      <div className="gap-sm grid shrink-0 grid-cols-3">
        <KpiCard
          variant="subtle"
          label={labels.registeredCustomers}
          value={effectiveTotal}
          trend={labels.thisMonth}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.vip}
          value={effectiveVip}
          trend={effectiveTotal === 0 ? "0%" : `${Math.round((effectiveVip / effectiveTotal) * VIP_PERCENT_MULTIPLIER)}%`}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.avgSpend}
          value={`€${avgSpend}`}
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
          {labels.newCustomer}
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <CustomersTable customers={filteredCustomers} labels={tableLabels} />
      </div>

      <NewCustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        labels={labels.newCustomerDialog}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export { SheetCrm };

export type { SheetCrmProps, SheetCrmLabels };
