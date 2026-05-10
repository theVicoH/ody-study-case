import React, { useState } from "react";

import { cn } from "@/lib/utils";

interface HeatmapChartProps {
  data: ReadonlyArray<ReadonlyArray<number>>;
  hourLabels: ReadonlyArray<string>;
  dayLabels: ReadonlyArray<string>;
  className?: string;
  formatTooltip?: (value: number, day: string, hour: string) => string;
}

const MIN_CELL_OPACITY = 0.06;
const PEAK_BOOST_THRESHOLD = 0.7;
const HOUR_COLUMN_WIDTH = 36;
const PERCENT_MULTIPLIER = 100;

const HeatmapChart = ({
  data,
  hourLabels,
  dayLabels,
  className,
  formatTooltip
}: HeatmapChartProps): React.JSX.Element => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const flat = data.flat();
  const maxValue = flat.length > 0 ? Math.max(...flat) : 1;

  return (
    <div className={cn("gap-xs flex w-full flex-col", className)}>
      <div
        className="gap-3xs relative grid w-full"
        style={{
          gridTemplateColumns: `${HOUR_COLUMN_WIDTH}px repeat(${dayLabels.length}, minmax(0, 1fr))`
        }}
      >
        <div />
        {dayLabels.map((day) => (
          <div
            key={day}
            className="typo-caption text-muted-foreground text-center"
          >
            {day}
          </div>
        ))}

        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="pr-3xs typo-caption text-muted-foreground flex items-center justify-end tabular-nums">
              {hourLabels[rowIndex] ?? ""}
            </div>
            {row.map((value, colIndex) => {
              const normalized = maxValue > 0 ? value / maxValue : 0;
              const isPeak = normalized >= PEAK_BOOST_THRESHOLD;
              const isHovered = hoveredCell?.row === rowIndex && hoveredCell.col === colIndex;
              const dayLabel = dayLabels[colIndex] ?? "";
              const hourLabel = hourLabels[rowIndex] ?? "";
              const percent = Math.round(normalized * PERCENT_MULTIPLIER);
              const tooltipText = formatTooltip
                ? formatTooltip(value, dayLabel, hourLabel)
                : `${dayLabel} ${hourLabel}: ${percent}%`;

              return (
                <div
                  key={colIndex}
                  className="relative"
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <button
                    type="button"
                    aria-label={tooltipText}
                    onFocus={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onBlur={() => setHoveredCell(null)}
                    className={cn(
                      "bg-primary block aspect-[3/1] min-h-5 w-full cursor-pointer rounded-sm transition-all",
                      isPeak && "shadow-[0_0_12px_-2px_var(--color-primary)]",
                      isHovered && "ring-foreground/40 ring-2"
                    )}
                    style={{
                      opacity: Math.max(MIN_CELL_OPACITY, normalized)
                    }}
                  />
                  {isHovered && (
                    <div className="bg-popover ring-foreground/10 typo-caption text-foreground gap-3xs px-xs py-2xs pointer-events-none absolute -top-12 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center rounded-md whitespace-nowrap ring-1">
                      <span className="text-muted-foreground">{dayLabel} · {hourLabel}</span>
                      <span className="typo-button tabular-nums">{percent}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export { HeatmapChart };

export type { HeatmapChartProps };
