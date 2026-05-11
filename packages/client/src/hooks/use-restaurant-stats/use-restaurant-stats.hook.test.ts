import { describe, expect, it } from "vitest";

import type { ApiRestaurantStats } from "@/types/api/api.types";

import { mapApiStatsToDetailed } from "@/hooks/use-restaurant-stats/use-restaurant-stats.hook";


const MONTHS_PER_YEAR = 12;
const YEARS_OF_DATA = 5;
const HOURS_PER_DAY = 24;
const FILLED_VALUE = 0.5;
const HUNDRED_THOUSAND = 100_000;
const ONE_MILLION = 1_000_000;
const POS_TREND = 3;
const NEG_TREND = -POS_TREND;

const baseStats: ApiRestaurantStats = {
  todayRevenueCents: 12_345,
  todayCovers: 24,
  avgTicketCents: 5_000,
  fillRate: 70,
  weeklyRevenueCents: [10_000, 20_000, 30_000, 40_000, 50_000, 60_000, 70_000],
  monthlyRevenueCents: Array.from({ length: MONTHS_PER_YEAR }, () => HUNDRED_THOUSAND),
  yearlyRevenueCents: Array.from({ length: YEARS_OF_DATA }, () => ONE_MILLION),
  heatmap: [
    [0, 0.5, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  topItems: [{ id: "d1", name: "Burger", category: "main", priceCents: 1_200, sold: 12 }],
  sparklineData: Array.from({ length: HOURS_PER_DAY }, () => FILLED_VALUE),
  customers: 87,
  openOrders: 5,
  covers: 280,
  revenueCents: 280_000,
  orders: 42,
  trendPercent: 12,
  rating: 4.5
};

describe("mapApiStatsToDetailed", () => {
  it("converts cents to euros (rounded)", () => {
    const detailed = mapApiStatsToDetailed(baseStats);

    expect(detailed.todayRevenue).toBe(123);
    expect(detailed.avgTicket).toBe(50);
    expect(detailed.revenue).toBe(2800);
    expect(detailed.weeklyRevenue[0]).toBe(100);
    expect(detailed.topItems[0]?.price).toBe(12);
  });

  it("formats trend with leading sign and percent", () => {
    expect(mapApiStatsToDetailed({ ...baseStats, trendPercent: 0 }).trend).toBe("+0%");
    expect(mapApiStatsToDetailed({ ...baseStats, trendPercent: 8 }).trend).toBe("+8%");
    expect(mapApiStatsToDetailed({ ...baseStats, trendPercent: NEG_TREND }).trend).toBe("−3%");
  });

  it("preserves array shapes for heatmap/weekly/sparkline", () => {
    const detailed = mapApiStatsToDetailed(baseStats);

    expect(detailed.weeklyRevenue).toHaveLength(7);
    expect(detailed.monthlyRevenue).toHaveLength(12);
    expect(detailed.yearlyRevenue).toHaveLength(5);
    expect(detailed.heatmap).toHaveLength(6);
    expect(detailed.heatmap[0]).toHaveLength(7);
    expect(detailed.sparklineData).toHaveLength(24);
  });

  it("formats rating to 1 decimal", () => {
    expect(mapApiStatsToDetailed({ ...baseStats, rating: 4 }).rating).toBe("4.0");
    expect(mapApiStatsToDetailed({ ...baseStats, rating: 4.567 }).rating).toBe("4.6");
  });
});
