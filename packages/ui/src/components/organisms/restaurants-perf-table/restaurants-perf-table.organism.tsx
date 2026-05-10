import React from "react";

import type { DataTableColumn } from "@/components/molecules/data-table/data-table.molecule";

import { DataTable } from "@/components/molecules/data-table/data-table.molecule";
import { SparklineChart } from "@/components/molecules/sparkline-chart/sparkline-chart.molecule";
import { cn } from "@/lib/utils";



const SPARKLINE_HEIGHT = 28;

type Performance = "good" | "warn" | "bad";

const PERF_DOT_CLASSES: Record<Performance, string> = {
  good: "bg-status-good",
  warn: "bg-status-warn",
  bad: "bg-status-bad"
};

interface RestaurantPerfRow {
  id: string;
  name: string;
  performance: Performance;
  revenue: number;
  sparklineData?: ReadonlyArray<number>;
}

interface RestaurantsPerfTableLabels {
  colStatus: string;
  colRestaurant: string;
  colTrend: string;
  colRevenue: string;
  empty: string;
  previous: string;
  next: string;
  filterAll: string;
  perfGood: string;
  perfWarn: string;
  perfBad: string;
}

interface RestaurantsPerfTableProps {
  restaurants: ReadonlyArray<RestaurantPerfRow>;
  labels: RestaurantsPerfTableLabels;
  pageSize?: number;
  className?: string;
  highlightId?: string;
}

const RestaurantsPerfTable = ({
  restaurants,
  labels,
  pageSize,
  className,
  highlightId
}: RestaurantsPerfTableProps): React.JSX.Element => {
  const columns: ReadonlyArray<DataTableColumn<RestaurantPerfRow>> = [
    {
      id: "performance",
      header: labels.colStatus,
      align: "center",
      className: "w-12",
      cell: (r) => (
        <span
          className={cn(
            "inline-block size-2 shrink-0 rounded-full",
            PERF_DOT_CLASSES[r.performance]
          )}
          aria-label={r.performance}
        />
      ),
      filter: {
        getValue: (r) => r.performance,
        options: [
          { label: labels.perfGood, value: "good" },
          { label: labels.perfWarn, value: "warn" },
          { label: labels.perfBad, value: "bad" }
        ],
        allLabel: labels.filterAll
      }
    },
    {
      id: "name",
      header: labels.colRestaurant,
      align: "start",
      cell: (r) => (
        <span className="text-foreground typo-body-sm truncate">{r.name}</span>
      ),
      sort: { getValue: (r) => r.name }
    },
    {
      id: "trend",
      header: labels.colTrend,
      align: "end",
      className: "w-24",
      cell: (r) =>
        r.sparklineData && r.sparklineData.length > 1 ? (
          <div className="w-3xl">
            <SparklineChart data={r.sparklineData} height={SPARKLINE_HEIGHT} />
          </div>
        ) : null
    },
    {
      id: "revenue",
      header: labels.colRevenue,
      align: "end",
      cell: (r) => (
        <span className="text-foreground typo-body-sm tabular-nums">
          €{r.revenue.toLocaleString("fr-FR")}
        </span>
      ),
      sort: { getValue: (r) => r.revenue }
    }
  ];

  return (
    <DataTable
      data={restaurants}
      columns={columns}
      rowKey={(r) => r.id}
      pageSize={pageSize}
      className={className}
      rowClassName={(r) => (r.id === highlightId ? "bg-primary/10 hover:bg-primary/15" : "")}
      labels={{
        empty: labels.empty,
        previous: labels.previous,
        next: labels.next,
        filterAll: labels.filterAll
      }}
    />
  );
};

export { RestaurantsPerfTable };

export type { RestaurantsPerfTableProps, RestaurantsPerfTableLabels, RestaurantPerfRow };
