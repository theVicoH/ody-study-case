import { RestaurantStatsSnapshot } from "@/value-objects/restaurant-stats/restaurant-stats/restaurant-stats.value-object";

import type {
  RestaurantStatsSnapshotProps,
  TopItemSnapshot
} from "@/value-objects/restaurant-stats/restaurant-stats/restaurant-stats.value-object";
import type { OrderStatus } from "@/entities/order/order.entity";

export interface StatsOrderItemInput {
  readonly refKind: "menu" | "dish";
  readonly refId: string;
  readonly nameSnapshot: string;
  readonly category: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
}

export interface StatsOrderInput {
  readonly placedAt: Date;
  readonly totalCents: number;
  readonly status: OrderStatus;
  readonly items: ReadonlyArray<StatsOrderItemInput>;
}

export interface RestaurantStatsCalculatorInput {
  readonly orders: ReadonlyArray<StatsOrderInput>;
  readonly totalTables: number;
  readonly occupiedTables: number;
  readonly clientCount: number;
  readonly now: Date;
  readonly rating?: number;
}

const HEATMAP_HOURS = [12, 13, 14, 19, 20, 21] as const;
const HEATMAP_HOUR_INDEX = new Map<number, number>(HEATMAP_HOURS.map((h, i) => [h, i]));
const WEEKLY_DAYS = 7;
const MONTHLY_BUCKETS = 12;
const YEARLY_BUCKETS = 5;
const SPARKLINE_HOURS = 24;
const TOP_ITEMS_LIMIT = 5;
const FILL_RATE_PERCENT = 100;
const PERCENT_FACTOR = 100;
const TREND_DIVISOR = 1;
const DEFAULT_RATING = 4.5;
const HEATMAP_LOOKBACK_DAYS = 28;
const OPEN_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>(["pending", "preparing", "ready"]);

const startOfDay = (d: Date): Date => {
  const x = new Date(d);

  x.setHours(0, 0, 0, 0);

  return x;
};

const addDays = (d: Date, n: number): Date => {
  const x = new Date(d);

  x.setDate(x.getDate() + n);

  return x;
};

const dowMonFirst = (d: Date): number => (d.getDay() + 6) % 7;

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear()
  && a.getMonth() === b.getMonth()
  && a.getDate() === b.getDate();

const sumQuantity = (items: ReadonlyArray<StatsOrderItemInput>): number =>
  items.reduce((acc, it) => acc + it.quantity, 0);

const computeWeeklyRevenue = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number[] => {
  const start = addDays(startOfDay(now), -(WEEKLY_DAYS - 1));
  const buckets = new Array<number>(WEEKLY_DAYS).fill(0);

  for (const order of orders) {
    if (order.placedAt < start) continue;
    const dow = dowMonFirst(order.placedAt);

    buckets[dow] = (buckets[dow] ?? 0) + order.totalCents;
  }

  return buckets;
};

const computeMonthlyRevenue = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number[] => {
  const year = now.getFullYear();
  const buckets = new Array<number>(MONTHLY_BUCKETS).fill(0);

  for (const order of orders) {
    if (order.placedAt.getFullYear() !== year) continue;
    const m = order.placedAt.getMonth();

    buckets[m] = (buckets[m] ?? 0) + order.totalCents;
  }

  return buckets;
};

const computeYearlyRevenue = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number[] => {
  const startYear = now.getFullYear() - (YEARLY_BUCKETS - 1);
  const buckets = new Array<number>(YEARLY_BUCKETS).fill(0);

  for (const order of orders) {
    const idx = order.placedAt.getFullYear() - startYear;

    if (idx < 0 || idx >= YEARLY_BUCKETS) continue;
    buckets[idx] = (buckets[idx] ?? 0) + order.totalCents;
  }

  return buckets;
};

const computeHeatmap = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number[][] => {
  const counts: number[][] = HEATMAP_HOURS.map(() => new Array<number>(WEEKLY_DAYS).fill(0));
  const since = addDays(startOfDay(now), -HEATMAP_LOOKBACK_DAYS);

  for (const order of orders) {
    if (order.placedAt < since) continue;
    const hourIdx = HEATMAP_HOUR_INDEX.get(order.placedAt.getHours());

    if (hourIdx === undefined) continue;
    const dow = dowMonFirst(order.placedAt);
    const row = counts[hourIdx];

    if (!row) continue;
    row[dow] = (row[dow] ?? 0) + 1;
  }

  let max = 0;

  for (const row of counts) {
    for (const v of row) {
      if (v > max) max = v;
    }
  }

  if (max === 0) {
    return counts;
  }

  return counts.map((row) => row.map((v) => v / max));
};

const computeSparkline = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number[] => {
  const hours = new Array<number>(SPARKLINE_HOURS).fill(0);
  const today = startOfDay(now);

  for (const order of orders) {
    if (!isSameDay(order.placedAt, today)) continue;
    const h = order.placedAt.getHours();

    hours[h] = (hours[h] ?? 0) + order.totalCents;
  }

  let max = 0;

  for (const v of hours) {
    if (v > max) max = v;
  }

  if (max === 0) return hours;

  return hours.map((v) => v / max);
};

const computeTopItems = (orders: ReadonlyArray<StatsOrderInput>): TopItemSnapshot[] => {
  const map = new Map<string, TopItemSnapshot>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.refId);

      if (existing) {
        map.set(item.refId, { ...existing, sold: existing.sold + item.quantity });
      } else {
        map.set(item.refId, {
          id: item.refId,
          name: item.nameSnapshot,
          category: item.category,
          priceCents: item.unitPriceCents,
          sold: item.quantity
        });
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, TOP_ITEMS_LIMIT);
};

const computeTrendPercent = (
  orders: ReadonlyArray<StatsOrderInput>,
  now: Date
): number => {
  const cutoffCurrent = addDays(startOfDay(now), -(WEEKLY_DAYS - 1));
  const cutoffPrior = addDays(cutoffCurrent, -WEEKLY_DAYS);
  let current = 0;
  let prior = 0;

  for (const order of orders) {
    if (order.placedAt >= cutoffCurrent) {
      current += order.totalCents;
    } else if (order.placedAt >= cutoffPrior) {
      prior += order.totalCents;
    }
  }

  if (prior === 0) {
    return current === 0 ? 0 : FILL_RATE_PERCENT;
  }

  return Math.round(((current - prior) / prior) * PERCENT_FACTOR * TREND_DIVISOR);
};

export const restaurantStatsCalculator = {
  calculate(input: RestaurantStatsCalculatorInput): RestaurantStatsSnapshot {
    const today = startOfDay(input.now);
    const last7 = addDays(today, -(WEEKLY_DAYS - 1));

    const ordersToday = input.orders.filter((o) => isSameDay(o.placedAt, today));
    const ordersLast7 = input.orders.filter((o) => o.placedAt >= last7);

    const todayRevenueCents = ordersToday.reduce((acc, o) => acc + o.totalCents, 0);
    const todayCovers = ordersToday.reduce((acc, o) => acc + sumQuantity(o.items), 0);
    const avgTicketCents = ordersToday.length === 0
      ? 0
      : Math.round(todayRevenueCents / ordersToday.length);

    const revenueCents = ordersLast7.reduce((acc, o) => acc + o.totalCents, 0);
    const covers = ordersLast7.reduce((acc, o) => acc + sumQuantity(o.items), 0);
    const orders = ordersLast7.length;

    const fillRate = input.totalTables > 0
      ? Math.round((input.occupiedTables / input.totalTables) * FILL_RATE_PERCENT)
      : 0;

    const openOrders = input.orders.filter((o) => OPEN_STATUSES.has(o.status)).length;

    const props: RestaurantStatsSnapshotProps = {
      todayRevenueCents,
      todayCovers,
      avgTicketCents,
      fillRate,
      weeklyRevenueCents: computeWeeklyRevenue(input.orders, input.now),
      monthlyRevenueCents: computeMonthlyRevenue(input.orders, input.now),
      yearlyRevenueCents: computeYearlyRevenue(input.orders, input.now),
      heatmap: computeHeatmap(input.orders, input.now),
      topItems: computeTopItems(input.orders),
      sparklineData: computeSparkline(input.orders, input.now),
      customers: input.clientCount,
      openOrders,
      covers,
      revenueCents,
      orders,
      trendPercent: computeTrendPercent(input.orders, input.now),
      rating: input.rating ?? DEFAULT_RATING
    };

    return RestaurantStatsSnapshot.create(props);
  }
};
