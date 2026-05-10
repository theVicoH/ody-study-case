import React, { useState } from "react";

import { cn } from "@/lib/utils";

interface BarChartProps {
  values: ReadonlyArray<number>;
  labels: ReadonlyArray<string>;
  className?: string;
  formatValue?: (value: number) => string;
  formatTooltip?: (value: number, label: string) => string;
  height?: number;
  showInlineValues?: boolean;
}

const BAR_HEIGHT_PCT_MULTIPLIER = 100;
const BAR_DEFAULT_HEIGHT = 120;
const GRID_LINES = 3;
const THOUSAND = 1000;
const HUNDRED = 100;
const TEN = 10;

const defaultFormat = (value: number): string => {
  if (value >= THOUSAND) {
    return `${Math.round(value / HUNDRED) / TEN}k`;
  }

  return String(Math.round(value));
};

const BarChart = ({
  values,
  labels,
  className,
  formatValue,
  formatTooltip,
  height = BAR_DEFAULT_HEIGHT,
  showInlineValues = true
}: BarChartProps): React.JSX.Element => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...values) || 1;
  const peakIndex = values.indexOf(max);
  const fmt = formatValue ?? defaultFormat;

  return (
    <div className={cn("gap-sm flex w-full flex-col", className)}>
      <div className="relative w-full" style={{ height }}>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: GRID_LINES + 1 }, (_, index) => (
            <div
              key={index}
              className="border-border/40 border-t border-dashed"
            />
          ))}
        </div>
        <div className="gap-sm relative flex h-full w-full items-end justify-between">
          {values.map((value, index) => {
            const heightPercent = (value / max) * BAR_HEIGHT_PCT_MULTIPLIER;
            const isPeak = index === peakIndex;
            const isHovered = hoveredIndex === index;
            const tooltipText = formatTooltip
              ? formatTooltip(value, labels[index] ?? "")
              : `${labels[index] ?? ""}: ${fmt(value)}`;

            return (
              <div
                key={index}
                className="group/bar gap-xs relative flex h-full flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
              >
                {showInlineValues && (
                  <span
                    className={cn(
                      "typo-caption tabular-nums",
                      isPeak ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {fmt(value)}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={tooltipText}
                  className={cn(
                    "w-full max-w-10 cursor-pointer rounded-md transition-all",
                    isPeak
                      ? "bg-primary shadow-[0_0_24px_-4px_var(--color-primary)]"
                      : "bg-primary/40 hover:bg-primary/70",
                    isHovered && !isPeak && "bg-primary/80"
                  )}
                  style={{ height: `${heightPercent}%`, minHeight: 4 }}
                />
                {isHovered && (
                  <div className="bg-popover ring-foreground/10 typo-caption text-foreground gap-3xs px-xs py-2xs pointer-events-none absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center rounded-md whitespace-nowrap ring-1">
                    <span className="text-muted-foreground">{labels[index] ?? ""}</span>
                    <span className="typo-button tabular-nums">{fmt(value)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="gap-sm flex w-full justify-between">
        {labels.map((label, index) => (
          <span
            key={index}
            className={cn(
              "typo-caption flex-1 text-center transition-colors",
              hoveredIndex === index ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export { BarChart };

export type { BarChartProps };
