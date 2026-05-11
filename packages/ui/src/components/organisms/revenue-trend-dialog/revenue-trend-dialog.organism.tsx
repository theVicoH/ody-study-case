import React from "react";

import { RevenueStatsGrid } from "@/components/molecules/revenue-stats-grid/revenue-stats-grid.molecule";
import { SparklineChart } from "@/components/molecules/sparkline-chart/sparkline-chart.molecule";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { deltaDirectionFrom, formatPercentDelta } from "@/lib/stats/stats.util";

interface RevenueTrendDialogLabels {
  title: string;
  description: string;
  total: string;
  peakHour: string;
  lowHour: string;
  avgHourly: string;
  vsPrior: string;
  timelineTitle: string;
}

interface RevenueTrendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: RevenueTrendDialogLabels;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  hourlyValues: ReadonlyArray<number>;
  hourlyLabels: ReadonlyArray<string>;
  formatRevenue: (value: number) => string;
}

const DIALOG_MAX_WIDTH = "min(960px, calc(100vw - 2rem))";
const SPARKLINE_HEIGHT = 140;

const RevenueTrendDialog = ({
  open,
  onOpenChange,
  labels,
  selectedDate,
  onSelectedDateChange,
  minDate,
  maxDate,
  hourlyValues,
  hourlyLabels,
  formatRevenue
}: RevenueTrendDialogProps): React.JSX.Element => {
  const delta = formatPercentDelta(hourlyValues);
  const deltaDirection = deltaDirectionFrom(delta);

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
            />
          </div>

          <div className="gap-sm flex flex-1 flex-col">
            <RevenueStatsGrid
              values={hourlyValues}
              bucketLabels={hourlyLabels}
              labels={{
                total: labels.total,
                average: labels.avgHourly,
                peak: labels.peakHour,
                low: labels.lowHour
              }}
              formatValue={formatRevenue}
            />

            <div className="gap-sm flex flex-col">
              <div className="flex items-center justify-between">
                <p className="typo-overline text-muted-foreground">{labels.timelineTitle}</p>
                <span
                  className={`typo-caption ${deltaDirection === "up" ? "text-status-good" : "text-status-bad"}`}
                >
                  {labels.vsPrior}: {delta}
                </span>
              </div>
              <SparklineChart
                data={hourlyValues}
                height={SPARKLINE_HEIGHT}
                xLabels={hourlyLabels}
                formatValue={(value) => formatRevenue(value)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { RevenueTrendDialog };

export type {
  RevenueTrendDialogProps,
  RevenueTrendDialogLabels
};
