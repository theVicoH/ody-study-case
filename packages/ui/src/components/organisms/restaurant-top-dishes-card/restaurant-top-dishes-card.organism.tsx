import React, { useMemo } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const TOP_DISHES_LIMIT = 5;
const RANK_COLORS = ["text-yellow-400", "text-zinc-400", "text-amber-600"] as const;

interface TopDishItem {
  name: string;
  category: string;
  sold: number;
  price: number;
}

interface RestaurantTopDishesCardLabels {
  title: string;
  soldWord: string;
  empty: string;
}

interface RestaurantTopDishesCardProps {
  labels: RestaurantTopDishesCardLabels;
  items: ReadonlyArray<TopDishItem>;
  limit?: number;
  formatPrice?: (value: number) => string;
}

const defaultFormatPrice = (value: number): string => `€${value.toFixed(2)}`;

const RestaurantTopDishesCard = ({
  labels,
  items,
  limit = TOP_DISHES_LIMIT,
  formatPrice = defaultFormatPrice
}: RestaurantTopDishesCardProps): React.JSX.Element => {
  const topDishes = useMemo(
    () => [...items].sort((a, b) => b.sold - a.sold).slice(0, limit),
    [items, limit]
  );

  return (
    <Card size="sm">
      <CardHeader className="border-b !pb-2">
        <CardTitle className="typo-caption">{labels.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {topDishes.length === 0 ? (
          <p className="text-muted-foreground typo-caption px-md py-sm">{labels.empty}</p>
        ) : (
          <ol>
            {topDishes.map((dish, idx) => (
              <li
                key={dish.name}
                className="hover:bg-muted/30 px-md py-xs gap-sm flex items-center transition-colors"
              >
                <span className={`typo-caption w-xs shrink-0 text-center tabular-nums ${RANK_COLORS[idx] ?? "text-muted-foreground"}`}>
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground typo-caption truncate">{dish.name}</p>
                  <p className="text-muted-foreground typo-caption truncate">{dish.category}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-foreground typo-caption tabular-nums">
                    {dish.sold} <span className="text-muted-foreground typo-caption">{labels.soldWord}</span>
                  </p>
                  <p className="text-muted-foreground typo-caption tabular-nums">{formatPrice(dish.price)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

export { RestaurantTopDishesCard };

export type {
  RestaurantTopDishesCardProps,
  RestaurantTopDishesCardLabels,
  TopDishItem
};
