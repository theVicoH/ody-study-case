import React from "react";

import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import {
  averageValues,
  indexOfMax,
  indexOfMin,
  labelAtIndex,
  minValueOf,
  peakValue,
  sumValues
} from "@/lib/stats/stats.util";

interface RevenueStatsGridLabels {
  total: string;
  average: string;
  peak: string;
  low: string;
}

interface RevenueStatsGridProps {
  values: ReadonlyArray<number>;
  bucketLabels: ReadonlyArray<string>;
  labels: RevenueStatsGridLabels;
  formatValue: (value: number) => string;
  className?: string;
}

const RevenueStatsGrid = ({
  values,
  bucketLabels,
  labels,
  formatValue,
  className
}: RevenueStatsGridProps): React.JSX.Element => {
  const total = sumValues(values);
  const avg = averageValues(values);
  const peak = peakValue(values);
  const low = minValueOf(values);
  const peakStr = labelAtIndex(bucketLabels, indexOfMax(values));
  const lowStr = labelAtIndex(bucketLabels, indexOfMin(values));

  return (
    <div className={`gap-sm grid grid-cols-2 ${className ?? ""}`}>
      <KpiCard variant="subtle" label={labels.total} value={formatValue(total)} />
      <KpiCard variant="subtle" label={labels.average} value={formatValue(avg)} />
      <KpiCard
        variant="subtle"
        label={labels.peak}
        value={formatValue(peak)}
        trend={peakStr}
        trendDirection="up"
      />
      <KpiCard
        variant="subtle"
        label={labels.low}
        value={formatValue(low)}
        trend={lowStr}
        trendDirection="down"
      />
    </div>
  );
};

export { RevenueStatsGrid };

export type { RevenueStatsGridProps, RevenueStatsGridLabels };
