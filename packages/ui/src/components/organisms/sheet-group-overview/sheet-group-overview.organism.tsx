import React from "react";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { PerfSummaryCell } from "@/components/molecules/perf-summary-cell/perf-summary-cell.molecule";
import { RestaurantsPerfTable } from "@/components/organisms/restaurants-perf-table/restaurants-perf-table.organism";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


interface RestaurantSummaryItem {
  id: string;
  name: string;
  performance: "good" | "warn" | "bad";
  revenue: number;
  sparklineData?: ReadonlyArray<number>;
}

interface SheetGroupOverviewLabels {
  restaurants: string;
  performing: string;
  performingTrend: string;
  groupRevenue: string;
  perfBreakdown: string;
  today: string;
  good: string;
  warn: string;
  bad: string;
  allRestaurants: string;
  colStatus: string;
  colRestaurant: string;
  colTrend: string;
  colRevenue: string;
  empty: string;
  paginationPrev: string;
  paginationNext: string;
  filterAll: string;
  addRestaurant?: string;
}

interface SheetGroupOverviewProps {
  labels: SheetGroupOverviewLabels;
  total: number;
  good: number;
  warn: number;
  bad: number;
  totalRevenue?: number;
  restaurants?: ReadonlyArray<RestaurantSummaryItem>;
  onAddRestaurant?: () => void;
}

const PERF_TABLE_PAGE_SIZE = 6;

const SheetGroupOverview = ({
  labels,
  total,
  good,
  warn,
  bad,
  totalRevenue,
  restaurants,
  onAddRestaurant
}: SheetGroupOverviewProps): React.JSX.Element => (
  <>
    {onAddRestaurant && labels.addRestaurant ? (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onAddRestaurant}>
          <span aria-hidden className="text-base leading-none">+</span>
          <span className="typo-body-sm">{labels.addRestaurant}</span>
        </Button>
      </div>
    ) : null}
    <div className="gap-sm grid grid-cols-2">
      <KpiCard variant="subtle" label={labels.restaurants} value={total} />
      <KpiCard
        variant="subtle"
        label={labels.performing}
        value={good}
        trend={labels.performingTrend}
        trendDirection="up"
      />
      {totalRevenue !== undefined && (
        <KpiCard
          variant="subtle"
          label={labels.groupRevenue}
          value={`€${totalRevenue.toLocaleString("fr-FR")}`}
          className="col-span-2"
        />
      )}
    </div>

    <Card>
      <CardHeader className="border-b">
        <CardTitle>{labels.perfBreakdown}</CardTitle>
        <CardAction>
          <Muted>{labels.today}</Muted>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="gap-sm grid grid-cols-3">
          <PerfSummaryCell value={good} label={labels.good} tone="good" />
          <PerfSummaryCell value={warn} label={labels.warn} tone="warn" />
          <PerfSummaryCell value={bad} label={labels.bad} tone="bad" />
        </div>
      </CardContent>
    </Card>

    {restaurants && restaurants.length > 0 && (
      <div className="gap-xs flex flex-col">
        <p className="text-muted-foreground typo-overline px-2xs">{labels.allRestaurants}</p>
        <div className="h-full">
          <RestaurantsPerfTable
            restaurants={restaurants}
            pageSize={PERF_TABLE_PAGE_SIZE}
            labels={{
              colStatus: labels.colStatus,
              colRestaurant: labels.colRestaurant,
              colTrend: labels.colTrend,
              colRevenue: labels.colRevenue,
              empty: labels.empty,
              previous: labels.paginationPrev,
              next: labels.paginationNext,
              filterAll: labels.filterAll,
              perfGood: labels.good,
              perfWarn: labels.warn,
              perfBad: labels.bad
            }}
          />
        </div>
      </div>
    )}
  </>
);

export { SheetGroupOverview };

export type { SheetGroupOverviewProps, SheetGroupOverviewLabels, RestaurantSummaryItem };
