import React from "react";
import type { ComponentProps } from "react";

import { useGroupStats, useRestaurantStats } from "@workspace/client";


import { SheetStats } from "@/components/organisms/sheet-stats/sheet-stats.organism";
import { Skeleton } from "@/components/ui/skeleton";


type SheetStatsLabels = ComponentProps<typeof SheetStats>["labels"];

interface ConnectedStatsProps {
  restaurantId: string;
  labels: SheetStatsLabels;
}

interface ConnectedGroupStatsProps {
  restaurantIds: ReadonlyArray<string>;
  labels: SheetStatsLabels;
}

const StatsSkeleton = (): React.JSX.Element => (
  <div className="gap-md flex flex-col">
    <div className="gap-sm grid grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-4xl rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-4xl w-full rounded-lg" />
    <Skeleton className="h-4xl w-full rounded-lg" />
  </div>
);

const ConnectedStats = ({ restaurantId, labels }: ConnectedStatsProps): React.JSX.Element => {
  const { stats, isLoading } = useRestaurantStats(restaurantId);

  if (isLoading || !stats) return <StatsSkeleton />;

  return <SheetStats labels={labels} stats={stats} restaurantId={restaurantId} />;
};

const ConnectedGroupStats = ({ restaurantIds, labels }: ConnectedGroupStatsProps): React.JSX.Element => {
  const { stats, isLoading } = useGroupStats(restaurantIds);

  if (isLoading || !stats) return <StatsSkeleton />;

  return <SheetStats labels={labels} stats={stats} restaurantId="__group" />;
};

export { ConnectedStats, ConnectedGroupStats };
