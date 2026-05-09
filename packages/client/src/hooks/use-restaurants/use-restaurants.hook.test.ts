import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRestaurants } from "@/hooks/use-restaurants/use-restaurants.hook";

describe("useRestaurants", () => {
  it("returns the restaurant list", () => {
    const { result } = renderHook(() => useRestaurants());

    expect(result.current.restaurants.length).toBeGreaterThan(0);
  });

  it("computes a summary with totals per performance bucket", () => {
    const { result } = renderHook(() => useRestaurants());
    const { summary, restaurants } = result.current;

    expect(summary.total).toBe(restaurants.length);
    expect(summary.good + summary.warn + summary.bad).toBe(restaurants.length);
  });

  it("flags the worst bucket as bad when at least one restaurant is failing", () => {
    const { result } = renderHook(() => useRestaurants());

    expect(result.current.summary.worstClass).toBe("bad");
    expect(result.current.summary.worstLabel).toContain("alerte");
  });

  it("exposes a stats helper that yields deterministic data", () => {
    const { result } = renderHook(() => useRestaurants());
    const restaurant = result.current.restaurants[0];
    const stats = result.current.statsFor(restaurant);

    expect(stats.covers).toBeGreaterThan(0);
    expect(stats.rating).toMatch(/^\d\.\d$/);
  });

  it("exposes detailedStatsFor with heatmap and weekly revenue", () => {
    const { result } = renderHook(() => useRestaurants());
    const restaurant = result.current.restaurants[0];
    const stats = result.current.detailedStatsFor(restaurant);

    expect(stats.weeklyRevenue).toHaveLength(7);
    expect(stats.heatmap).toHaveLength(6);
  });

  it("exposes customersFor returning a list", () => {
    const { result } = renderHook(() => useRestaurants());
    const customers = result.current.customersFor(result.current.restaurants[0]);

    expect(customers.length).toBeGreaterThan(0);
  });

  it("exposes ordersFor returning a list with valid statuses", () => {
    const { result } = renderHook(() => useRestaurants());
    const orders = result.current.ordersFor(result.current.restaurants[0]);
    const validStatuses = ["new", "preparing", "ready", "served", "paid"];

    orders.forEach((o) => expect(validStatuses).toContain(o.status));
  });

  it("exposes menuItemsFor returning dishes", () => {
    const { result } = renderHook(() => useRestaurants());
    const items = result.current.menuItemsFor(result.current.restaurants[0]);

    expect(items.length).toBeGreaterThan(0);
    expect(items[0].price).toBeGreaterThan(0);
  });

  it("exposes settingsFor returning restaurant settings", () => {
    const { result } = renderHook(() => useRestaurants());
    const r = result.current.restaurants[0];
    const settings = result.current.settingsFor(r);

    expect(settings.name).toBe(r.name);
  });
});
