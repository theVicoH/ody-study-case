import React, { useMemo } from "react";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const PERCENT = 100;
const COMPARISON_PRECISION = 0;

interface GroupRestaurantPerf {
  id: string;
  revenue: number;
}

interface RestaurantVsGroupCardLabels {
  title: string;
  caption: string;
  revenue: string;
  groupAverage: string;
}

interface RestaurantVsGroupCardProps {
  labels: RestaurantVsGroupCardLabels;
  ownRevenue: number;
  groupRestaurants: ReadonlyArray<GroupRestaurantPerf>;
  formatRevenue: (value: number) => string;
}

const formatDelta = (value: number, suffix = ""): string => {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(COMPARISON_PRECISION)}${suffix}`;
};

const RestaurantVsGroupCard = ({
  labels,
  ownRevenue,
  groupRestaurants,
  formatRevenue
}: RestaurantVsGroupCardProps): React.JSX.Element | null => {
  const groupAverage = useMemo(() => {
    if (groupRestaurants.length === 0) {
      return null;
    }
    const total = groupRestaurants.reduce((sum, r) => sum + r.revenue, 0);

    return total / groupRestaurants.length;
  }, [groupRestaurants]);

  if (groupAverage === null) {
    return null;
  }

  const revenueDelta = groupAverage > 0 ? ((ownRevenue - groupAverage) / groupAverage) * PERCENT : 0;

  return (
    <Card size="sm">
      <CardHeader className="border-b !pb-2">
        <CardTitle className="typo-caption">{labels.title}</CardTitle>
        <CardAction>
          <Muted className="typo-caption">{labels.caption}</Muted>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-xs">
        <dl className="divide-border/60 typo-caption divide-y">
          <div className="py-xs gap-sm flex items-center justify-between">
            <dt><Muted className="typo-caption">{labels.revenue}</Muted></dt>
            <dd className="gap-xs flex items-center">
              <span className="text-foreground typo-caption tabular-nums">
                {formatRevenue(ownRevenue)}
              </span>
              <Badge variant={revenueDelta >= 0 ? "secondary" : "destructive"}>
                {formatDelta(revenueDelta, "%")}
              </Badge>
            </dd>
          </div>
          <div className="py-xs gap-sm flex items-center justify-between">
            <dt><Muted className="typo-caption">{labels.groupAverage}</Muted></dt>
            <dd className="text-muted-foreground typo-caption tabular-nums">
              {formatRevenue(Math.round(groupAverage))}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export { RestaurantVsGroupCard };

export type {
  RestaurantVsGroupCardProps,
  RestaurantVsGroupCardLabels,
  GroupRestaurantPerf
};
