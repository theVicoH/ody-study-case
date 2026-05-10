import React, { useMemo } from "react";

import { cn } from "@/lib/utils";


interface RestaurantTopItem {
  name: string;
  category: string;
  price: number;
  sold: number;
}


interface TopDishesTableLabels {
  colRank: string;
  colDish: string;
  colCategory: string;
  colPrice: string;
  colSold: string;
  empty: string;
  previous: string;
  next: string;
  filterAll: string;
  soldWord: string;
}

interface TopDishesTableProps {
  items: ReadonlyArray<RestaurantTopItem>;
  labels: TopDishesTableLabels;
  pageSize?: number;
  className?: string;
}

const LEADER_RANK = 1;
const PERCENT = 100;
const MIN_FILL = 1;

const TopDishesTable = ({
  items,
  labels,
  pageSize: _pageSize,
  className
}: TopDishesTableProps): React.JSX.Element => {
  const ranked = useMemo(
    () => items.map((item, index) => ({ ...item, rank: index + 1 })),
    [items]
  );

  const maxSold = useMemo(
    () => Math.max(MIN_FILL, ...items.map((item) => item.sold)),
    [items]
  );

  if (ranked.length === 0) {
    return (
      <div
        className={cn(
          "text-muted-foreground typo-caption flex h-full items-center justify-center",
          className
        )}
        role="status"
      >
        {labels.empty}
      </div>
    );
  }

  return (
    <ol
      className={cn("gap-xs flex flex-col", className)}
      aria-label={labels.colDish}
    >
      {ranked.map((item) => {
        const isLeader = item.rank === LEADER_RANK;
        const fillPct = Math.max(MIN_FILL, (item.sold / maxSold) * PERCENT);

        return (
          <li
            key={`${item.rank}-${item.name}`}
            className={cn(
              "group relative grid grid-cols-[auto_1fr_auto] items-center overflow-hidden",
              "gap-lg px-lg py-md rounded-lg",
              "duration-base ease-emphasized transition-all",
              isLeader
                ? "glass-primary"
                : "hover:border-border hover:bg-card/60 border border-transparent"
            )}
          >
            {isLeader ? (
              <span
                aria-hidden
                className="bg-ambient-glow pointer-events-none absolute -inset-px opacity-40"
              />
            ) : null}

            <span
              aria-label={`${labels.colRank} ${item.rank}`}
              className={cn(
                "font-heading relative leading-none font-bold tabular-nums",
                isLeader
                  ? "text-gradient-brand text-[3rem]"
                  : "text-muted-foreground/30 group-hover:text-muted-foreground/60 text-[2rem]"
              )}
            >
              {String(item.rank).padStart(2, "0")}
            </span>

            <div className="gap-xs relative flex min-w-0 flex-col">
              <div className="gap-md flex items-baseline">
                <span className="text-foreground typo-h5 truncate">
                  {item.name}
                </span>
                <span className="text-muted-foreground typo-overline shrink-0">
                  {item.category}
                </span>
              </div>

              <div
                className="bg-muted/60 h-3xs relative w-full overflow-hidden rounded-full"
                role="presentation"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    "duration-slower ease-emphasized transition-[width]",
                    isLeader
                      ? "bg-gradient-brand"
                      : "bg-foreground/40 group-hover:bg-foreground/65"
                  )}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>

            <div className="gap-2xs relative flex flex-col items-end">
              <span className="text-foreground typo-h5 tabular-nums">
                €{item.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground typo-caption tabular-nums">
                {item.sold}
                <span className="text-muted-foreground/60 ml-2xs">
                  {labels.soldWord}
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export { TopDishesTable };

export type { TopDishesTableProps, TopDishesTableLabels };
