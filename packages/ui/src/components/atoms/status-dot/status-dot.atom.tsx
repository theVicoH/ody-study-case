import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusDotVariants = cva(
  "inline-block shrink-0 rounded-full",
  {
    variants: {
      status: {
        good: "bg-status-good shadow-[0_0_6px_var(--color-status-good)]",
        warn: "bg-status-warn shadow-[0_0_6px_var(--color-status-warn)]",
        bad: "bg-status-bad shadow-[0_0_6px_var(--color-status-bad)]",
        disabled: "bg-muted-foreground/40"
      },
      size: {
        sm: "size-1.5",
        md: "size-2",
        lg: "size-2.5"
      }
    },
    defaultVariants: {
      status: "good",
      size: "md"
    }
  }
);

interface StatusDotProps extends VariantProps<typeof statusDotVariants> {
  className?: string;
}

const StatusDot = ({ status, size, className }: StatusDotProps): React.JSX.Element => {

  return (
    <span
      role="status"
      aria-label={status ?? "good"}
      className={cn(statusDotVariants({ status, size }), className)}
    />
  );
};

export { StatusDot, statusDotVariants };

export type { StatusDotProps };
