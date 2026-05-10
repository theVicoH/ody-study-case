import React from "react";

import { BarChart } from "@/components/molecules/bar-chart/bar-chart.molecule";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  averageValues,
  deltaDirectionFrom,
  formatPercentDelta,
  indexOfMax,
  indexOfMin,
  labelAtIndex,
  peakValue,
  sumValues
} from "@/lib/stats/stats.util";

interface WeeklyRevenueDialogLabels {
  title: string;
  description: string;
  total: string;
  average: string;
  peak: string;
  best: string;
  worst: string;
  growth: string;
  weeklyTitle: string;
}

interface WeeklyRevenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: WeeklyRevenueDialogLabels;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
  weeklyValues: ReadonlyArray<number>;
  weeklyLabels: ReadonlyArray<string>;
  formatRevenue: (value: number) => string;
}

const DIALOG_MAX_WIDTH = "min(900px, calc(100vw - 2rem))";
const BAR_HEIGHT = 200;

const WeeklyRevenueDialog = ({
  open,
  onOpenChange,
  labels,
  selectedDate,
  onSelectedDateChange,
  maxDate,
  minDate,
  weeklyValues,
  weeklyLabels,
  formatRevenue
}: WeeklyRevenueDialogProps): React.JSX.Element => {
  const total = sumValues(weeklyValues);
  const avg = averageValues(weeklyValues);
  const peak = peakValue(weeklyValues);
  const bestStr = labelAtIndex(weeklyLabels, indexOfMax(weeklyValues));
  const worstStr = labelAtIndex(weeklyLabels, indexOfMin(weeklyValues));
  const growth = formatPercentDelta(weeklyValues);
  const growthDirection = deltaDirectionFrom(growth);

  const handleDateSelect = (date: Date | undefined): void => {
    if (date !== undefined) {
      onSelectedDateChange(date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-md flex w-full max-w-full flex-col"
        style={{ width: DIALOG_MAX_WIDTH, maxWidth: DIALOG_MAX_WIDTH }}
      >
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <div className="gap-md flex flex-col sm:flex-row sm:items-start">
          <div className="border-border bg-card shrink-0 rounded-lg border">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (maxDate !== undefined && date > maxDate) {
                  return true;
                }
                if (minDate !== undefined && date < minDate) {
                  return true;
                }

                return false;
              }}
              initialFocus
            />
          </div>

          <div className="gap-sm flex flex-1 flex-col">
            <div className="gap-sm grid grid-cols-2 sm:grid-cols-3">
              <KpiCard variant="subtle" label={labels.total} value={formatRevenue(total)} />
              <KpiCard variant="subtle" label={labels.average} value={formatRevenue(avg)} />
              <KpiCard variant="subtle" label={labels.peak} value={formatRevenue(peak)} />
              <KpiCard variant="subtle" label={labels.best} value={bestStr} />
              <KpiCard variant="subtle" label={labels.worst} value={worstStr} />
              <KpiCard
                variant="subtle"
                label={labels.growth}
                value={growth}
                trend={growth}
                trendDirection={growthDirection}
              />
            </div>

            <div className="gap-sm flex flex-col">
              <p className="typo-overline text-muted-foreground">{labels.weeklyTitle}</p>
              <BarChart
                values={weeklyValues}
                labels={weeklyLabels}
                formatValue={formatRevenue}
                formatTooltip={(value, label) => `${label}: ${formatRevenue(value)}`}
                height={BAR_HEIGHT}
                showInlineValues={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { WeeklyRevenueDialog };

export type {
  WeeklyRevenueDialogProps,
  WeeklyRevenueDialogLabels
};
