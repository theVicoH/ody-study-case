import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { cn } from "@/lib/utils";

const kpiCardVariants = cva(
  "glass p-sm gap-xs @container flex flex-col rounded-lg",
  {
    variants: {
      variant: {
        default: "",
        subtle: "opacity-90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const trendVariants = cva(
  "typo-overline px-xs py-3xs inline-flex items-center rounded-full",
  {
    variants: {
      direction: {
        up: "bg-status-good/15 text-status-good",
        down: "bg-status-bad/15 text-status-bad"
      }
    }
  }
);

interface KpiCardProps extends VariantProps<typeof kpiCardVariants> {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  className?: string;
}

const KpiCard = ({
  label,
  value,
  trend,
  trendDirection,
  variant,
  className
}: KpiCardProps): React.JSX.Element => {

  return (
    <div className={cn(kpiCardVariants({ variant }), className)}>
      <Muted className="typo-caption">{label}</Muted>
      <div className="gap-xs flex flex-wrap items-baseline justify-between">
        <h1 className="typo-h1 text-[clamp(1.125rem,12cqw,1.75rem)]">
          {value}
        </h1>
        {trend && trendDirection && (
          <span className={trendVariants({ direction: trendDirection })}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export { KpiCard };

export type { KpiCardProps };
