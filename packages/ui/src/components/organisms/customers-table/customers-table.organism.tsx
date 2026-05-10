import React from "react";

import type { DataTableColumn } from "@/components/molecules/data-table/data-table.molecule";
import type { RestaurantCustomer } from "@workspace/client";

import { PencilIcon } from "@/components/icons/pencil/pencil.icon";
import { TrashIcon } from "@/components/icons/trash/trash.icon";
import { DataTable } from "@/components/molecules/data-table/data-table.molecule";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";



type CustomerTag = RestaurantCustomer["tag"];

const TAG_BADGE_VARIANTS: Record<CustomerTag, "default" | "warning" | "success"> = {
  VIP: "default",
  Regular: "success",
  New: "warning"
};

const AVATAR_CLASSES = [
  "bg-primary/30",
  "bg-secondary/50",
  "bg-muted",
  "bg-primary/20"
] as const;

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");

  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
};

const HASH_PRIME = 31;

const hashIndex = (id: string, modulo: number): number => {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * HASH_PRIME + id.charCodeAt(i)) | 0;
  }

  return Math.abs(hash) % modulo;
};

interface CustomersTableLabels {
  colCustomer: string;
  colVisits: string;
  colSpent: string;
  colTag: string;
  colActions?: string;
  edit?: string;
  delete?: string;
  tagVip: string;
  tagRegular: string;
  tagNew: string;
  empty: string;
  previous: string;
  next: string;
  filterAll: string;
  visitsWord: string;
}

interface CustomersTableServerPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CustomersTableProps {
  customers: ReadonlyArray<RestaurantCustomer>;
  labels: CustomersTableLabels;
  pageSize?: number;
  className?: string;
  onEdit?: (customer: RestaurantCustomer) => void;
  onDelete?: (customer: RestaurantCustomer) => void;
  serverPagination?: CustomersTableServerPagination;
}

const ACTION_ICON_SIZE = 14;

const CustomersTable = ({
  customers,
  labels,
  pageSize,
  className,
  onEdit,
  onDelete,
  serverPagination
}: CustomersTableProps): React.JSX.Element => {
  const tagLabels: Record<CustomerTag, string> = {
    VIP: labels.tagVip,
    Regular: labels.tagRegular,
    New: labels.tagNew
  };

  const columns: ReadonlyArray<DataTableColumn<RestaurantCustomer>> = [
    {
      id: "customer",
      header: labels.colCustomer,
      align: "start",
      cell: (c) => {
        const avatarClass = AVATAR_CLASSES[hashIndex(c.id, AVATAR_CLASSES.length)];

        return (
          <div className="gap-sm flex items-center">
            <div
              className={cn(
                avatarClass,
                "text-foreground typo-caption size-md flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              )}
            >
              {getInitials(c.name)}
            </div>
            <div className="min-w-0">
              <p className="text-foreground typo-button truncate">
                {c.name}
              </p>
              <p className="text-muted-foreground typo-caption truncate">
                {c.email}
              </p>
            </div>
          </div>
        );
      },
      sort: { getValue: (c) => c.name }
    },
    {
      id: "visits",
      header: labels.colVisits,
      align: "end",
      cell: (c) => (
        <span className="text-muted-foreground typo-caption">
          {c.visits} {labels.visitsWord}
        </span>
      ),
      sort: { getValue: (c) => c.visits }
    },
    {
      id: "spent",
      header: labels.colSpent,
      align: "end",
      cell: (c) => (
        <span className="text-foreground typo-body-sm tabular-nums">
          €{c.spent.toFixed(2)}
        </span>
      ),
      sort: { getValue: (c) => c.spent }
    },
    {
      id: "tag",
      header: labels.colTag,
      align: "end",
      cell: (c) => (
        <Badge variant={TAG_BADGE_VARIANTS[c.tag]}>{tagLabels[c.tag]}</Badge>
      ),
      filter: {
        getValue: (c) => c.tag,
        options: [
          { label: labels.tagVip, value: "VIP" },
          { label: labels.tagRegular, value: "Regular" },
          { label: labels.tagNew, value: "New" }
        ],
        allLabel: labels.filterAll
      }
    },
    ...(onEdit ?? onDelete
      ? [{
        id: "actions",
        header: labels.colActions ?? "",
        align: "end" as const,
        cell: (c: RestaurantCustomer) => (
          <div className="gap-xs flex items-center justify-end">
            {onEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={labels.edit ?? ""}
                onClick={() => onEdit(c)}
              >
                <PencilIcon size={ACTION_ICON_SIZE} />
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={labels.delete ?? ""}
                onClick={() => onDelete(c)}
              >
                <TrashIcon size={ACTION_ICON_SIZE} />
              </Button>
            ) : null}
          </div>
        )
      }]
      : [])
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      rowKey={(c) => c.id}
      pageSize={pageSize}
      className={className}
      serverPagination={serverPagination}
      labels={{
        empty: labels.empty,
        previous: labels.previous,
        next: labels.next,
        filterAll: labels.filterAll
      }}
    />
  );
};

export { CustomersTable };

export type { CustomersTableProps, CustomersTableLabels };
