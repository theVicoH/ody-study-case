import { describe, expect, test } from "vitest";

import { RestaurantStatsSnapshot } from "@/value-objects/restaurant-stats/restaurant-stats/restaurant-stats.value-object";

const PROPS = {
  todayRevenueCents: 100,
  todayCovers: 5,
  avgTicketCents: 20,
  fillRate: 0.5,
  weeklyRevenueCents: [1, 2],
  monthlyRevenueCents: [3],
  yearlyRevenueCents: [4],
  heatmap: [[1, 2]],
  topItems: [{ id: "x", name: "x", category: "y", priceCents: 10, sold: 1 }],
  sparklineData: [1, 2, 3],
  customers: 10,
  openOrders: 2,
  covers: 5,
  revenueCents: 100,
  orders: 1,
  trendPercent: 5,
  rating: 4.5
};

describe("RestaurantStatsSnapshot", () => {
  test("should create from props", () => {
    const snap = RestaurantStatsSnapshot.create(PROPS);

    expect(snap.todayRevenueCents).toBe(100);
    expect(snap.rating).toBe(4.5);
  });

  test("should clone arrays in toJSON", () => {
    const snap = RestaurantStatsSnapshot.create(PROPS);
    const json = snap.toJSON();

    expect(json.weeklyRevenueCents).not.toBe(PROPS.weeklyRevenueCents);
    expect(json.heatmap[0]).not.toBe(PROPS.heatmap[0]);
  });
});
