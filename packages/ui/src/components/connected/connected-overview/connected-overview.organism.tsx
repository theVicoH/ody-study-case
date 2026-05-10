import React from "react";

import { useRestaurantStats } from "@workspace/client";

import type {
  RestaurantPerfRow,
  SheetRestaurantOverviewLabels
} from "@/components/organisms/sheet-restaurant-overview/sheet-restaurant-overview.organism";
import type { Restaurant, RestaurantSettings } from "@workspace/client";

import { SheetRestaurantOverview } from "@/components/organisms/sheet-restaurant-overview/sheet-restaurant-overview.organism";
import { Skeleton } from "@/components/ui/skeleton";


interface ConnectedOverviewProps {
  restaurantId: string;
  restaurant: Restaurant;
  settings: RestaurantSettings | null;
  groupRestaurants?: ReadonlyArray<RestaurantPerfRow>;
  labels: SheetRestaurantOverviewLabels;
}

const OverviewSkeleton = (): React.JSX.Element => (
  <div className="gap-md flex flex-col">
    <div className="gap-sm grid grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-2xl rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-3xl w-full rounded-lg" />
    <Skeleton className="h-4xl w-full rounded-lg" />
  </div>
);

const ConnectedOverview = ({
  restaurantId,
  restaurant,
  settings,
  groupRestaurants,
  labels
}: ConnectedOverviewProps): React.JSX.Element => {
  const { stats, isLoading } = useRestaurantStats(restaurantId);

  if (isLoading || !stats) return <OverviewSkeleton />;

  return (
    <SheetRestaurantOverview
      labels={labels}
      restaurantId={restaurantId}
      restaurantType={restaurant.type}
      performance={restaurant.performance}
      stats={{
        covers: stats.covers,
        revenue: stats.revenue,
        orders: stats.orders,
        rating: stats.rating,
        trend: stats.trend
      }}
      openOrders={stats.openOrders}
      fillRate={stats.fillRate}
      sparklineData={stats.sparklineData}
      phone={settings?.phone}
      maxCovers={settings?.maxCovers}
      tableService={settings?.tableService}
      clickAndCollect={settings?.clickAndCollect}
      groupRestaurants={groupRestaurants}
      topItems={stats.topItems}
    />
  );
};

export { ConnectedOverview };

export type { ConnectedOverviewProps };
