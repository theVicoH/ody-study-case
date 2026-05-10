import React from "react";

import { HeatmapChart } from "@/components/molecules/heatmap-chart/heatmap-chart.molecule";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface AffluenceDialogLabels {
  title: string;
  description: string;
  fillRate: string;
  peakSlot: string;
  quietSlot: string;
  heatmapTitle: string;
}

interface AffluenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: AffluenceDialogLabels;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
  data: ReadonlyArray<ReadonlyArray<number>>;
  hourLabels: ReadonlyArray<string>;
  dayLabels: ReadonlyArray<string>;
  formatTooltip?: (value: number, day: string, hour: string) => string;
}

const DIALOG_MAX_WIDTH = "min(960px, calc(100vw - 2rem))";
const PERCENT_MULTIPLIER = 100;

interface SlotInfo {
  value: number;
  hour: string;
  day: string;
}

const findExtremeSlot = (
  data: ReadonlyArray<ReadonlyArray<number>>,
  hourLabels: ReadonlyArray<string>,
  dayLabels: ReadonlyArray<string>,
  mode: "max" | "min"
): SlotInfo => {
  let value = mode === "max" ? -Infinity : Infinity;
  let hour = "—";
  let day = "—";

  data.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const isExtreme = mode === "max" ? cell > value : cell < value;

      if (isExtreme) {
        value = cell;
        hour = hourLabels[rowIdx] ?? "—";
        day = dayLabels[colIdx] ?? "—";
      }
    });
  });

  return {
    value: Number.isFinite(value) ? value : 0,
    hour,
    day
  };
};

const formatPercent = (value: number): string =>
  `${Math.round(value * PERCENT_MULTIPLIER)}%`;

const computeAverageFill = (data: ReadonlyArray<ReadonlyArray<number>>): number => {
  const flat = data.flat();

  if (flat.length === 0) {
    return 0;
  }

  const sum = flat.reduce((acc, v) => acc + v, 0);

  return sum / flat.length;
};

const AffluenceDialog = ({
  open,
  onOpenChange,
  labels,
  selectedDate,
  onSelectedDateChange,
  maxDate,
  minDate,
  data,
  hourLabels,
  dayLabels,
  formatTooltip
}: AffluenceDialogProps): React.JSX.Element => {
  const peakSlot = findExtremeSlot(data, hourLabels, dayLabels, "max");
  const quietSlot = findExtremeSlot(data, hourLabels, dayLabels, "min");
  const avgFill = computeAverageFill(data);

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

          <div className="gap-sm grid flex-1 grid-cols-1 sm:grid-cols-3">
            <KpiCard
              variant="subtle"
              label={labels.fillRate}
              value={formatPercent(avgFill)}
            />
            <KpiCard
              variant="subtle"
              label={labels.peakSlot}
              value={formatPercent(peakSlot.value)}
              trend={`${peakSlot.day} · ${peakSlot.hour}`}
              trendDirection="up"
            />
            <KpiCard
              variant="subtle"
              label={labels.quietSlot}
              value={formatPercent(quietSlot.value)}
              trend={`${quietSlot.day} · ${quietSlot.hour}`}
              trendDirection="down"
            />
          </div>
        </div>

        <div className="gap-sm flex flex-col">
          <p className="typo-overline text-muted-foreground">{labels.heatmapTitle}</p>
          <HeatmapChart
            data={data}
            hourLabels={hourLabels}
            dayLabels={dayLabels}
            formatTooltip={formatTooltip}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AffluenceDialog };

export type {
  AffluenceDialogProps,
  AffluenceDialogLabels
};
