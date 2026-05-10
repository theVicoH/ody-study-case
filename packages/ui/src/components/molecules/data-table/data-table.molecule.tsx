import React, { useEffect, useMemo, useState } from "react";

import { ArrowDownIcon } from "@/components/icons/arrow-down/arrow-down.icon";
import { ArrowDownUpIcon } from "@/components/icons/arrow-down-up/arrow-down-up.icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up/arrow-up.icon";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal/sliders-horizontal.icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";


const DEFAULT_PAGE_SIZE = 20;
const FILTER_ICON_SIZE = 12;
const PAGE_WINDOW = 1;
const ALL_FILTER_VALUE = "__all__";

interface DataTableColumnFilter<T> {
  options: ReadonlyArray<{ label: string; value: string }>;
  getValue: (row: T) => string;
  allLabel?: string;
}

interface DataTableColumnSort<T> {
  getValue: (row: T) => number | string;
}

type SortDirection = "asc" | "desc";

interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "start" | "end" | "center";
  filter?: DataTableColumnFilter<T>;
  sort?: DataTableColumnSort<T>;
}

interface DataTableLabels {
  empty: string;
  previous: string;
  next: string;
  filterAll: string;
}

interface DataTableServerPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  data: ReadonlyArray<T>;
  columns: ReadonlyArray<DataTableColumn<T>>;
  rowKey: (row: T) => string;
  labels: DataTableLabels;
  pageSize?: number;
  className?: string;
  rowClassName?: string | ((row: T) => string);
  searchQuery?: string;
  getSearchableText?: (row: T) => string;
  serverPagination?: DataTableServerPagination;
}

const alignClass = (_align?: "start" | "end" | "center"): string => {
  return "text-start";
};

const buildPageList = (current: number, total: number): Array<number | "ellipsis-left" | "ellipsis-right"> => {
  const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [];
  const window = PAGE_WINDOW;

  pages.push(1);

  const left = Math.max(2, current - window);
  const right = Math.min(total - 1, current + window);

  if (left > 2) {
    pages.push("ellipsis-left");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push("ellipsis-right");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
};

const DataTable = <T,>({
  data,
  columns,
  rowKey,
  labels,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
  rowClassName,
  searchQuery,
  getSearchableText,
  serverPagination
}: DataTableProps<T>): React.JSX.Element => {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortState, setSortState] = useState<{ columnId: string; direction: SortDirection } | null>(null);
  const [internalPage, setInternalPage] = useState(1);
  const isServer = serverPagination !== undefined;
  const page = isServer ? serverPagination.page : internalPage;
  const setPage = (p: number | ((prev: number) => number)): void => {
    if (isServer) {
      const next = typeof p === "function" ? p(serverPagination.page) : p;

      serverPagination.onPageChange(next);
    } else {
      setInternalPage(p);
    }
  };

  const searchedData = useMemo(() => {
    const trimmed = searchQuery?.trim().toLowerCase();

    if (!trimmed || !getSearchableText) return data;

    return data.filter((row) => getSearchableText(row).toLowerCase().includes(trimmed));
  }, [data, searchQuery, getSearchableText]);

  const filteredData = useMemo(() => {
    const activeColumnIds = Object.keys(columnFilters).filter((id) => columnFilters[id] !== undefined);

    if (activeColumnIds.length === 0) return searchedData;

    const filterColumns = columns.filter((col) => col.filter !== undefined && activeColumnIds.includes(col.id));

    return searchedData.filter((row) =>
      filterColumns.every((col) => {
        if (!col.filter) return true;
        const expected = columnFilters[col.id];

        if (expected === undefined) return true;

        return col.filter.getValue(row) === expected;
      }));
  }, [searchedData, columns, columnFilters]);

  const sortedData = useMemo(() => {
    if (!sortState) return filteredData;

    const sortColumn = columns.find((c) => c.id === sortState.columnId);

    if (!sortColumn?.sort) return filteredData;

    const getValue = sortColumn.sort.getValue;
    const dirMul = sortState.direction === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dirMul;
      }

      return String(va).localeCompare(String(vb)) * dirMul;
    });
  }, [filteredData, columns, sortState]);

  const totalPages = isServer
    ? Math.max(1, serverPagination.totalPages)
    : Math.max(1, Math.ceil(sortedData.length / pageSize));

  useEffect(() => {
    if (!isServer && internalPage > totalPages) {
      setInternalPage(totalPages);
    }
  }, [internalPage, totalPages, isServer]);

  const safePage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    if (isServer) return sortedData;
    const start = (safePage - 1) * pageSize;

    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize, isServer]);

  const handleSortClick = (columnId: string): void => {
    setSortState((prev) => {
      if (!prev || prev.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { columnId, direction: "desc" };
      }

      return null;
    });
    setPage(1);
  };

  const handleFilterChange = (columnId: string, value: string): void => {
    setColumnFilters((prev) => {
      const next = { ...prev };

      if (value === ALL_FILTER_VALUE) {
        delete next[columnId];
      } else {
        next[columnId] = value;
      }

      return next;
    });
    setPage(1);
  };

  const pageList = buildPageList(safePage, totalPages);

  return (
    <div className={cn(
      "glass flex h-full min-h-0 flex-col overflow-hidden rounded-xl",
      "[&_[data-slot=table-container]]:[scrollbar-width:none]",
      "[&_[data-slot=table-container]::-webkit-scrollbar]:hidden",
      className
    )}>
      <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Table>
          <TableHeader className="glass-strong sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => {
                const filterValue = columnFilters[col.id];
                const isFilterActive = filterValue !== undefined;
                const isSorted = sortState?.columnId === col.id;
                const sortDirection = isSorted ? sortState.direction : null;
                const SortIcon = sortDirection === "asc"
                  ? ArrowUpIcon
                  : sortDirection === "desc"
                    ? ArrowDownIcon
                    : ArrowDownUpIcon;

                return (
                  <TableHead
                    key={col.id}
                    className={cn(
                      "text-muted-foreground typo-overline",
                      alignClass(col.align),
                      col.headerClassName
                    )}
                  >
                    <div className="gap-2xs inline-flex items-center">
                      {col.sort ? (
                        <button
                          type="button"
                          onClick={() => handleSortClick(col.id)}
                          className={cn(
                            "hover:text-foreground gap-2xs inline-flex cursor-pointer items-center rounded-sm transition-colors",
                            isSorted && "text-foreground"
                          )}
                        >
                          <span>{col.header}</span>
                          <SortIcon
                            size={FILTER_ICON_SIZE}
                            className={cn(!isSorted && "opacity-50")}
                          />
                        </button>
                      ) : (
                        <span>{col.header}</span>
                      )}
                      {col.filter && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={(props) => (
                              <button
                                {...props}
                                type="button"
                                aria-label="Filter"
                                className={cn(
                                  "inline-flex size-5 items-center justify-center rounded-sm transition-colors",
                                  isFilterActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:bg-muted/50"
                                )}
                              >
                                <SlidersHorizontalIcon size={FILTER_ICON_SIZE} />
                              </button>
                            )}
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuRadioGroup
                              value={filterValue ?? ALL_FILTER_VALUE}
                              onValueChange={(v: string) => handleFilterChange(col.id, v)}
                            >
                              <DropdownMenuRadioItem value={ALL_FILTER_VALUE}>
                                {col.filter.allLabel ?? labels.filterAll}
                              </DropdownMenuRadioItem>
                              {col.filter.options.map((opt) => (
                                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground typo-caption py-3xl text-center"
                >
                  {labels.empty}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  className={cn(typeof rowClassName === "function" ? rowClassName(row) : rowClassName)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(alignClass(col.align), col.className)}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-xs py-xs border-foreground/10 shrink-0 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  {labels.previous}
                </PaginationPrevious>
              </PaginationItem>
              {pageList.map((entry, idx) => {
                if (entry === "ellipsis-left" || entry === "ellipsis-right") {
                  return (
                    <PaginationItem key={`${entry}-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={entry}>
                    <PaginationLink
                      isActive={entry === safePage}
                      onClick={() => setPage(entry)}
                    >
                      {entry}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  {labels.next}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export { DataTable };

export type {
  DataTableProps,
  DataTableColumn,
  DataTableColumnFilter,
  DataTableColumnSort,
  DataTableLabels,
  SortDirection
};
