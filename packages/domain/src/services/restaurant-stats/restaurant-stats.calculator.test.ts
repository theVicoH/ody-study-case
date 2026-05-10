import { describe, expect, test } from "vitest";

import { restaurantStatsCalculator } from "@/services/restaurant-stats/restaurant-stats.calculator";

import type { StatsOrderInput } from "@/services/restaurant-stats/restaurant-stats.calculator";

const NOW = new Date("2026-05-10T15:00:00Z");

const order = (overrides: Partial<StatsOrderInput> = {}): StatsOrderInput => ({
  placedAt: NOW,
  totalCents: 5000,
  status: "paid",
  items: [
    {
      refKind: "dish",
      refId: "dish-1",
      nameSnapshot: "Burger",
      category: "main",
      unitPriceCents: 2500,
      quantity: 2
    }
  ],
  ...overrides
});

describe("restaurantStatsCalculator", () => {
  test("returns zeroes when no orders, no tables, no clients", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.todayRevenueCents).toBe(0);
    expect(snap.todayCovers).toBe(0);
    expect(snap.avgTicketCents).toBe(0);
    expect(snap.fillRate).toBe(0);
    expect(snap.revenueCents).toBe(0);
    expect(snap.orders).toBe(0);
    expect(snap.trendPercent).toBe(0);
    expect(snap.openOrders).toBe(0);
    expect(snap.weeklyRevenueCents).toHaveLength(7);
    expect(snap.monthlyRevenueCents).toHaveLength(12);
    expect(snap.yearlyRevenueCents).toHaveLength(5);
    expect(snap.heatmap).toHaveLength(6);
    expect(snap.heatmap[0]).toHaveLength(7);
    expect(snap.sparklineData).toHaveLength(24);
    expect(snap.topItems).toHaveLength(0);
    expect(snap.rating).toBe(4.5);
  });

  test("aggregates today revenue and covers", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [order({ totalCents: 4000 }), order({ totalCents: 6000 })],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.todayRevenueCents).toBe(10000);
    expect(snap.todayCovers).toBe(4);
    expect(snap.avgTicketCents).toBe(5000);
  });

  test("computes fill rate as percentage", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [],
      totalTables: 10,
      occupiedTables: 7,
      clientCount: 0,
      now: NOW
    });

    expect(snap.fillRate).toBe(70);
  });

  test("counts open orders by status", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [
        order({ status: "pending" }),
        order({ status: "preparing" }),
        order({ status: "ready" }),
        order({ status: "served" }),
        order({ status: "paid" }),
        order({ status: "cancelled" })
      ],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.openOrders).toBe(3);
  });

  test("aggregates top items sold across orders, sorted desc", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [
        order({
          items: [
            { refKind: "dish", refId: "d1", nameSnapshot: "A", category: "x", unitPriceCents: 100, quantity: 3 },
            { refKind: "dish", refId: "d2", nameSnapshot: "B", category: "y", unitPriceCents: 200, quantity: 1 }
          ]
        }),
        order({
          items: [
            { refKind: "dish", refId: "d1", nameSnapshot: "A", category: "x", unitPriceCents: 100, quantity: 2 }
          ]
        })
      ],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.topItems[0]).toMatchObject({ id: "d1", sold: 5 });
    expect(snap.topItems[1]).toMatchObject({ id: "d2", sold: 1 });
  });

  test("trend = +100% when current has revenue and prior is 0", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [order({ totalCents: 1000 })],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.trendPercent).toBe(100);
  });

  test("trend computes pct change between last 7d and prior 7d", () => {
    const fiveDaysAgo = new Date(NOW); fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const tenDaysAgo = new Date(NOW); tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const snap = restaurantStatsCalculator.calculate({
      orders: [
        order({ placedAt: fiveDaysAgo, totalCents: 2000 }),
        order({ placedAt: tenDaysAgo, totalCents: 1000 })
      ],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0,
      now: NOW
    });

    expect(snap.trendPercent).toBe(100);
  });

  test("forwards client count as customers", () => {
    const snap = restaurantStatsCalculator.calculate({
      orders: [],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 42,
      now: NOW
    });

    expect(snap.customers).toBe(42);
  });
});
