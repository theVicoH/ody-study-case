import React from "react";

import type { RestaurantTopItem } from "@workspace/client";

import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { RestaurantDetailsCard } from "@/components/organisms/restaurant-details-card/restaurant-details-card.organism";
import { RestaurantTopDishesCard } from "@/components/organisms/restaurant-top-dishes-card/restaurant-top-dishes-card.organism";
import { RestaurantTrendCard } from "@/components/organisms/restaurant-trend-card/restaurant-trend-card.organism";
import { RestaurantVsGroupCard } from "@/components/organisms/restaurant-vs-group-card/restaurant-vs-group-card.organism";

const FILL_RATE_GOOD_THRESHOLD = 80;
const FILL_RATE_WARN_THRESHOLD = 50;

interface SheetRestaurantStats {
  covers: number;
  revenue: number;
  orders: number;
  rating: string;
  trend: string;
}

interface RestaurantPerfRow {
  id: string;
  name: string;
  performance: "good" | "warn" | "bad";
  revenue: number;
  sparklineData?: ReadonlyArray<number>;
}

interface SheetRestaurantOverviewLabels {
  covers: string;
  revenue: string;
  orders: string;
  rating: string;
  openOrders: string;
  fillRate: string;
  revenueTrend: string;
  trend24h: string;
  establishmentDetails: string;
  type: string;
  phone: string;
  capacity: string;
  services: string;
  tableService: string;
  clickAndCollect: string;
  vsGroupTitle: string;
  vsGroupCaption: string;
  vsGroupRevenue: string;
  vsGroupCovers: string;
  vsGroupTicket: string;
  groupAverage: string;
  coversUnit: (count: number) => string;
  topDishes: string;
  colDish: string;
  colSold: string;
  soldWord: string;
  emptyTopDishes: string;
}

interface SheetRestaurantOverviewProps {
  labels: SheetRestaurantOverviewLabels;
  restaurantId: string;
  restaurantType: string;
  performance: "good" | "warn" | "bad";
  stats: SheetRestaurantStats;
  openOrders?: number;
  fillRate?: number;
  sparklineData?: ReadonlyArray<number>;
  phone?: string;
  maxCovers?: number;
  tableService?: boolean;
  clickAndCollect?: boolean;
  groupRestaurants?: ReadonlyArray<RestaurantPerfRow>;
  topItems?: ReadonlyArray<RestaurantTopItem>;
}

const formatRevenueEur = (value: number): string =>
  `€${value.toLocaleString("fr-FR")}`;

const fillRateTrend = (rate: number): { trend: string; direction: "up" | "down" } => {
  if (rate >= FILL_RATE_GOOD_THRESHOLD) {
    return { trend: "↑", direction: "up" };
  }
  if (rate >= FILL_RATE_WARN_THRESHOLD) {
    return { trend: "~", direction: "up" };
  }

  return { trend: "↓", direction: "down" };
};

const SheetRestaurantOverview = ({
  labels,
  restaurantId: _restaurantId,
  restaurantType,
  performance,
  stats,
  openOrders,
  fillRate,
  sparklineData,
  phone,
  maxCovers,
  tableService,
  clickAndCollect,
  groupRestaurants,
  topItems
}: SheetRestaurantOverviewProps): React.JSX.Element => {
  const trendDir = performance === "bad" ? "down" : "up";
  const trendCard = sparklineData ? (
    <RestaurantTrendCard
      labels={{ title: labels.revenueTrend, badge: labels.trend24h }}
      data={sparklineData}
    />
  ) : null;

  const detailsCard = (
    <RestaurantDetailsCard
      labels={{
        title: labels.establishmentDetails,
        type: labels.type,
        phone: labels.phone,
        capacity: labels.capacity,
        services: labels.services,
        tableService: labels.tableService,
        clickAndCollect: labels.clickAndCollect,
        coversUnit: labels.coversUnit
      }}
      restaurantType={restaurantType}
      phone={phone}
      maxCovers={maxCovers}
      tableService={tableService}
      clickAndCollect={clickAndCollect}
    />
  );

  const comparisonCard = groupRestaurants ? (
    <RestaurantVsGroupCard
      labels={{
        title: labels.vsGroupTitle,
        caption: labels.vsGroupCaption,
        revenue: labels.vsGroupRevenue,
        groupAverage: labels.groupAverage
      }}
      ownRevenue={stats.revenue}
      groupRestaurants={groupRestaurants}
      formatRevenue={formatRevenueEur}
    />
  ) : null;

  const topDishesCard = (
    <RestaurantTopDishesCard
      labels={{
        title: labels.topDishes,
        soldWord: labels.soldWord,
        empty: labels.emptyTopDishes
      }}
      items={topItems ?? []}
    />
  );

  const fillRateMeta = fillRate !== undefined ? fillRateTrend(fillRate) : null;
  const hasInfoRow = trendCard !== null || comparisonCard !== null || detailsCard !== null;

  return (
    <>
      <div className="gap-sm grid grid-cols-2 lg:grid-cols-3">
        <KpiCard
          variant="subtle"
          label={labels.covers}
          value={stats.covers}
          trend={stats.trend}
          trendDirection={trendDir}
        />
        <KpiCard
          variant="subtle"
          label={labels.revenue}
          value={formatRevenueEur(stats.revenue)}
          trend={stats.trend}
          trendDirection={trendDir}
        />
        <KpiCard
          variant="subtle"
          label={labels.orders}
          value={stats.orders}
          trend={stats.trend}
          trendDirection={trendDir}
        />
        <KpiCard variant="subtle" label={labels.rating} value={`★ ${stats.rating}`} />
        {openOrders !== undefined && (
          <KpiCard
            variant="subtle"
            label={labels.openOrders}
            value={openOrders}
          />
        )}
        {fillRate !== undefined && fillRateMeta !== null && (
          <KpiCard
            variant="subtle"
            label={labels.fillRate}
            value={`${fillRate}%`}
            trend={fillRateMeta.trend}
            trendDirection={fillRateMeta.direction}
          />
        )}
      </div>

      {hasInfoRow && (
        <div className="gap-sm grid grid-cols-1 @3xl:grid-cols-2">
          {trendCard}
          {comparisonCard}
          {detailsCard}
        </div>
      )}

      {topDishesCard}
    </>
  );
};

export { SheetRestaurantOverview };

export type {
  SheetRestaurantOverviewProps,
  SheetRestaurantStats,
  SheetRestaurantOverviewLabels,
  RestaurantPerfRow
};
