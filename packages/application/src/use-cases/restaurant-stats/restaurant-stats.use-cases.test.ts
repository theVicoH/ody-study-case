import { describe, expect, test } from "vitest";

import { FakeRestaurantStatsRepository } from "@/fakes/restaurant-stats/restaurant-stats.fake";
import {
  GetGroupStatsUseCase,
  GetRestaurantStatsUseCase
} from "@/use-cases/restaurant-stats/restaurant-stats.use-cases";

const RESTAURANT_A = "11111111-1111-1111-1111-111111111111";
const RESTAURANT_B = "22222222-2222-2222-2222-222222222222";
const NOW = new Date("2026-05-10T15:00:00Z");

describe("GetRestaurantStatsUseCase", () => {
  test("aggregates today revenue + clients via fake repo", async () => {
    const repo = new FakeRestaurantStatsRepository();

    repo.seed(RESTAURANT_A, {
      orders: [
        {
          placedAt: NOW,
          totalCents: 4500,
          status: "paid",
          items: [{ refKind: "dish", refId: "d1", nameSnapshot: "Pizza", category: "main", unitPriceCents: 2250, quantity: 2 }]
        }
      ],
      totalTables: 10,
      occupiedTables: 5,
      clientCount: 12
    });

    const result = await new GetRestaurantStatsUseCase(repo).execute({
      restaurantId: RESTAURANT_A,
      now: NOW
    });

    expect(result.todayRevenueCents).toBe(4500);
    expect(result.todayCovers).toBe(2);
    expect(result.fillRate).toBe(50);
    expect(result.customers).toBe(12);
    expect(result.topItems[0]).toMatchObject({ id: "d1", sold: 2 });
  });

  test("returns zeroed snapshot when restaurant has no data", async () => {
    const repo = new FakeRestaurantStatsRepository();
    const result = await new GetRestaurantStatsUseCase(repo).execute({
      restaurantId: RESTAURANT_A,
      now: NOW
    });

    expect(result.todayRevenueCents).toBe(0);
    expect(result.weeklyRevenueCents).toHaveLength(7);
  });
});

describe("GetGroupStatsUseCase", () => {
  test("merges raw data across restaurants", async () => {
    const repo = new FakeRestaurantStatsRepository();

    repo.seed(RESTAURANT_A, {
      orders: [
        {
          placedAt: NOW,
          totalCents: 1000,
          status: "paid",
          items: [{ refKind: "dish", refId: "d1", nameSnapshot: "A", category: "x", unitPriceCents: 1000, quantity: 1 }]
        }
      ],
      totalTables: 4,
      occupiedTables: 2,
      clientCount: 3
    });
    repo.seed(RESTAURANT_B, {
      orders: [
        {
          placedAt: NOW,
          totalCents: 3000,
          status: "paid",
          items: [{ refKind: "dish", refId: "d2", nameSnapshot: "B", category: "x", unitPriceCents: 3000, quantity: 1 }]
        }
      ],
      totalTables: 6,
      occupiedTables: 3,
      clientCount: 5
    });

    const result = await new GetGroupStatsUseCase(repo).execute({
      restaurantIds: [RESTAURANT_A, RESTAURANT_B],
      now: NOW
    });

    expect(result.todayRevenueCents).toBe(4000);
    expect(result.fillRate).toBe(50);
    expect(result.customers).toBe(8);
    expect(result.topItems).toHaveLength(2);
  });
});
