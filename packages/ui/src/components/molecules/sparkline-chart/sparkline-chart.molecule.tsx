import React, { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface SparklineChartProps {
  data: ReadonlyArray<number>;
  height?: number;
  className?: string;
  xLabels?: ReadonlyArray<string>;
  showGrid?: boolean;
  formatValue?: (value: number, index: number) => string;
  formatLabel?: (index: number) => string;
}

const SPARKLINE_DEFAULT_HEIGHT = 96;
const SPARKLINE_VIEWBOX_WIDTH = 600;
const SPARKLINE_PADDING_X = 8;
const SPARKLINE_PADDING_TOP = 8;
const SPARKLINE_PADDING_BOTTOM = 8;
const GRID_LINES = 3;
const HUNDRED = 100;
const TEN = 10;
const THOUSAND = 1000;
const HOVER_DOT_RADIUS = 4;

const defaultFormatValue = (value: number): string => {
  if (value >= THOUSAND) {
    return `${Math.round(value / HUNDRED) / TEN}k`;
  }

  return value.toFixed(2);
};

const SparklineChart = ({
  data,
  height = SPARKLINE_DEFAULT_HEIGHT,
  className,
  xLabels,
  showGrid = true,
  formatValue,
  formatLabel
}: SparklineChartProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const uid = useId();
  const width = SPARKLINE_VIEWBOX_WIDTH;
  const innerHeight = height - SPARKLINE_PADDING_TOP - SPARKLINE_PADDING_BOTTOM;
  const gradientId = `sparkline-gradient-${uid.replace(/:/g, "")}`;

  if (data.length === 0) {
    return <div className={cn("w-full", className)} style={{ height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = data.length === 1
      ? width / 2
      : SPARKLINE_PADDING_X + (index / (data.length - 1)) * (width - SPARKLINE_PADDING_X * 2);
    const y = SPARKLINE_PADDING_TOP + (1 - (value - min) / range) * innerHeight;

    return { x, y };
  });

  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const prev = points[index - 1];
    const cpX = (prev.x + point.x) / 2;

    return `${acc} C ${cpX} ${prev.y} ${cpX} ${point.y} ${point.x} ${point.y}`;
  }, "");

  const baselineY = SPARKLINE_PADDING_TOP + innerHeight;
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaD = `${pathD} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;

  const gridYs = Array.from({ length: GRID_LINES }, (_, index) => {
    return SPARKLINE_PADDING_TOP + ((index + 1) / (GRID_LINES + 1)) * innerHeight;
  });

  const fmt = formatValue ?? defaultFormatValue;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const ratio = (event.clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, ratio));
    const index = Math.round(clamped * (data.length - 1));

    setHoveredIndex(index);
  };

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const hoveredXPercent = hoveredPoint ? (hoveredPoint.x / width) * HUNDRED : 0;
  const hoveredLabel = hoveredIndex !== null && formatLabel ? formatLabel(hoveredIndex) : null;

  return (
    <div className={cn("gap-xs flex w-full flex-col", className)}>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height }}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="color-mix(in oklch, var(--color-primary) 55%, transparent)"
              />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {showGrid &&
            gridYs.map((gy) => (
              <line
                key={gy}
                x1={0}
                x2={width}
                y1={gy}
                y2={gy}
                stroke="color-mix(in oklch, var(--color-border) 45%, transparent)"
                strokeWidth={1}
                strokeDasharray="2 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          <path d={areaD} fill={`url(#${gradientId})`} stroke="none" />
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-primary"
          />
          {hoveredPoint && (
            <>
              <line
                x1={hoveredPoint.x}
                x2={hoveredPoint.x}
                y1={SPARKLINE_PADDING_TOP}
                y2={baselineY}
                stroke="color-mix(in oklch, var(--color-foreground) 30%, transparent)"
                strokeWidth={1}
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={HOVER_DOT_RADIUS}
                className="fill-primary"
                stroke="var(--color-background)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="bg-popover ring-foreground/10 typo-caption text-foreground gap-3xs px-xs py-2xs pointer-events-none absolute -top-2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center rounded-md whitespace-nowrap ring-1"
            style={{ left: `${hoveredXPercent}%` }}
          >
            {hoveredLabel && <span className="text-muted-foreground">{hoveredLabel}</span>}
            <span className="typo-button tabular-nums">{fmt(data[hoveredIndex], hoveredIndex)}</span>
          </div>
        )}
      </div>
      {xLabels && xLabels.length > 0 && (
        <div className="px-xs flex w-full justify-between">
          {xLabels.map((label) => (
            <span
              key={label}
              className="typo-caption text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export { SparklineChart };

export type { SparklineChartProps };
