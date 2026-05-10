import React from "react";

import { SparklineChart } from "@/components/molecules/sparkline-chart/sparkline-chart.molecule";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const SPARKLINE_HEIGHT = 80;
const DEFAULT_X_LABELS = ["00h", "06h", "12h", "18h", "24h"] as const;
const MIN_DATA_POINTS = 2;

interface RestaurantTrendCardLabels {
  title: string;
  badge: string;
}

interface RestaurantTrendCardProps {
  labels: RestaurantTrendCardLabels;
  data: ReadonlyArray<number>;
  xLabels?: ReadonlyArray<string>;
  height?: number;
}

const RestaurantTrendCard = ({
  labels,
  data,
  xLabels,
  height = SPARKLINE_HEIGHT
}: RestaurantTrendCardProps): React.JSX.Element | null => {
  if (data.length < MIN_DATA_POINTS) {
    return null;
  }

  return (
    <Card size="sm">
      <CardHeader className="border-b !pb-2">
        <CardTitle className="typo-caption">{labels.title}</CardTitle>
        <CardAction>
          <Badge variant="ghost">{labels.badge}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-xs pb-xs px-0">
        <SparklineChart
          data={data}
          height={height}
          xLabels={xLabels ? [...xLabels] : [...DEFAULT_X_LABELS]}
        />
      </CardContent>
    </Card>
  );
};

export { RestaurantTrendCard };

export type { RestaurantTrendCardProps, RestaurantTrendCardLabels };
