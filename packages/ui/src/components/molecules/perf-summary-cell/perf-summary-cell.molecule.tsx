import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { H1 } from "@/components/atoms/typography/typography.atom";
import { cn } from "@/lib/utils";

const cellVariants = cva(
  "p-md rounded-md border text-center",
  {
    variants: {
      tone: {
        good: "border-status-good/30 bg-status-good/10 text-status-good",
        warn: "border-status-warn/30 bg-status-warn/10 text-status-warn",
        bad: "border-status-bad/30 bg-status-bad/10 text-status-bad"
      }
    },
    defaultVariants: {
      tone: "good"
    }
  }
);

interface PerfSummaryCellProps extends VariantProps<typeof cellVariants> {
  value: number;
  label: string;
  className?: string;
}

const PerfSummaryCell = ({
  value,
  label,
  tone,
  className
}: PerfSummaryCellProps): React.JSX.Element => (
  <div className={cn(cellVariants({ tone }), className)}>
    <H1 className="scroll-m-0">{value}</H1>
    <div className="typo-overline text-foreground/85 mt-xs">{label}</div>
  </div>
);

export { PerfSummaryCell, cellVariants };

export type { PerfSummaryCellProps };
