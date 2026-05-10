import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { cn } from "@/lib/utils";

const itemVariants = cva(
  "group hover:bg-foreground/5 gap-xs px-sm py-sm flex w-full items-start rounded-md border border-transparent text-left transition-all duration-150",
  {
    variants: {
      active: {
        true: "from-primary/15 to-accent/5 border-primary/35 bg-gradient-to-r shadow-[0_0_0_1px_hsl(var(--primary)/0.15)_inset]",
        false: "hover:border-foreground/5"
      },
      tone: {
        default: "",
        group: "mb-2xs"
      }
    },
    defaultVariants: {
      active: false,
      tone: "default"
    }
  }
);

interface RestaurantListItemProps extends VariantProps<typeof itemVariants> {
  name: string;
  caption?: string;
  status?: "good" | "warn" | "bad" | "disabled";
  badge?: string;
  onClick?: () => void;
  className?: string;
}

const RestaurantListItem = ({
  name,
  caption,
  status,
  badge,
  active,
  tone,
  onClick,
  className
}: RestaurantListItemProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className={cn(itemVariants({ active, tone }), className)}
  >
    <span className="min-w-0 flex-1">
      <span className="gap-xs flex items-center">
        {status ? <StatusDot status={status} size="sm" /> : null}
        <span
          className={cn(
            "typo-button truncate transition-colors",
            active ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
          )}
        >
          {name}
        </span>
      </span>
      {caption ? (
        <span className="text-muted-foreground typo-caption mt-3xs ps-md block truncate">
          {caption}
        </span>
      ) : null}
    </span>
    {badge ? (
      <span className="bg-primary/20 text-primary border-primary/40 typo-caption h-lg flex w-lg shrink-0 items-center justify-center rounded-md border">
        {badge}
      </span>
    ) : null}
  </button>
);

export { RestaurantListItem, itemVariants };

export type { RestaurantListItemProps };
