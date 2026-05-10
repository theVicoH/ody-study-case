import React, { useMemo, useState } from "react";


import type { NewCustomerDialogLabels, NewCustomerFormValues } from "@/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import type { RestaurantCustomer } from "@workspace/client";

import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { CustomersTable } from "@/components/organisms/customers-table/customers-table.organism";
import { NewCustomerDialog } from "@/components/organisms/new-customer-dialog/new-customer-dialog.organism";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";



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
  colActions?: string;
  edit?: string;
  delete?: string;
  filterAll: string;
  paginationPrev: string;
  paginationNext: string;
  visitsWord: string;
  newCustomerDialog: NewCustomerDialogLabels;
  deleteDialog?: {
    title: string;
    description: string;
    cancel: string;
    confirm: string;
  };
}

interface SheetCrmServerPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface SheetCrmProps {
  labels: SheetCrmLabels;
  customers: ReadonlyArray<RestaurantCustomer>;
  totalCustomers: number;
  vipCount: number;
  newThisMonth: number;
  onCreateCustomer?: (values: NewCustomerFormValues) => void;
  onUpdateCustomer?: (id: string, values: NewCustomerFormValues) => void;
  onDeleteCustomer?: (id: string) => void;
  serverPagination?: SheetCrmServerPagination;
  pageSize?: number;
  renderCreateDialog?: (props: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
}

const SheetCrm = ({
  labels,
  customers,
  totalCustomers,
  vipCount,
  newThisMonth,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  serverPagination,
  pageSize,
  renderCreateDialog
}: SheetCrmProps): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<RestaurantCustomer | null>(null);
  const [deleting, setDeleting] = useState<RestaurantCustomer | null>(null);

  const avgSpend = useMemo(() => {
    if (customers.length === 0) return 0;
    const total = customers.reduce((sum, c) => sum + c.spent, 0);

    return Math.round(total / customers.length);
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return customers;

    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q));
  }, [customers, search]);

  const tableLabels = {
    colCustomer: labels.colCustomer,
    colVisits: labels.colVisits,
    colSpent: labels.colSpent,
    colTag: labels.colTag,
    colActions: labels.colActions,
    edit: labels.edit,
    delete: labels.delete,
    tagVip: labels.tagVip,
    tagRegular: labels.tagRegular,
    tagNew: labels.tagNew,
    empty: labels.emptySearch,
    previous: labels.paginationPrev,
    next: labels.paginationNext,
    filterAll: labels.filterAll,
    visitsWord: labels.visitsWord
  };

  const handleCreate = (values: NewCustomerFormValues): void => {
    onCreateCustomer?.(values);
  };

  const handleEditSubmit = (values: NewCustomerFormValues): void => {
    if (editing) onUpdateCustomer?.(editing.id, values);
    setEditing(null);
  };

  const handleConfirmDelete = (): void => {
    if (deleting) onDeleteCustomer?.(deleting.id);
    setDeleting(null);
  };

  const editInitial: NewCustomerFormValues | undefined = editing
    ? {
      name: editing.name,
      firstName: editing.firstName,
      lastName: editing.lastName,
      email: editing.email,
      tag: editing.tag
    }
    : undefined;

  return (
    <>
      <div className="gap-sm grid shrink-0 grid-cols-3">
        <KpiCard
          variant="subtle"
          label={labels.registeredCustomers}
          value={totalCustomers}
          trend={`+${newThisMonth} ${labels.thisMonth}`}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.vip}
          value={vipCount}
          trend={totalCustomers === 0 ? "0%" : `${Math.round((vipCount / totalCustomers) * VIP_PERCENT_MULTIPLIER)}%`}
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
        {onCreateCustomer || renderCreateDialog ? (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <PlusIcon size={ICON_SIZE} data-icon="inline-start" />
            {labels.newCustomer}
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1">
        <CustomersTable
          customers={filteredCustomers}
          labels={tableLabels}
          pageSize={pageSize}
          serverPagination={serverPagination}
          onEdit={onUpdateCustomer ? (c) => setEditing(c) : undefined}
          onDelete={onDeleteCustomer ? (c) => setDeleting(c) : undefined}
          className="h-full"
        />
      </div>

      {renderCreateDialog
        ? renderCreateDialog({ open: createOpen, onOpenChange: setCreateOpen })
        : onCreateCustomer ? (
          <NewCustomerDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            labels={labels.newCustomerDialog}
            onSubmit={handleCreate}
          />
        ) : null}

      {onUpdateCustomer ? (
        <NewCustomerDialog
          open={editing !== null}
          onOpenChange={(next) => { if (!next) setEditing(null); }}
          labels={labels.newCustomerDialog}
          onSubmit={handleEditSubmit}
          mode="edit"
          initialValues={editInitial}
        />
      ) : null}

      {onDeleteCustomer && labels.deleteDialog ? (
        <Dialog open={deleting !== null} onOpenChange={(next) => { if (!next) setDeleting(null); }}>
          <DialogContent className="gap-md flex flex-col">
            <DialogHeader>
              <DialogTitle>{labels.deleteDialog.title}</DialogTitle>
              <DialogDescription>{labels.deleteDialog.description}</DialogDescription>
            </DialogHeader>
            <div className="gap-xs flex justify-end">
              <DialogClose render={<Button type="button" variant="outline" />}>
                {labels.deleteDialog.cancel}
              </DialogClose>
              <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
                {labels.deleteDialog.confirm}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export { SheetCrm };

export type { SheetCrmProps, SheetCrmLabels };
