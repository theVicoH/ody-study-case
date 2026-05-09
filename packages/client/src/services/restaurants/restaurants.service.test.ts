import { describe, expect, it } from "vitest";

import {
  computeRestaurantDetailedStats,
  computeRestaurantStats,
  getRestaurantById,
  getRestaurantSettings,
  listRestaurantCustomers,
  listRestaurantMenuItems,
  listRestaurantOrders,
  listRestaurants
} from "@/services/restaurants/restaurants.service";

describe("restaurants service", () => {
  it("returns the full restaurant list", () => {
    const restaurants = listRestaurants();

    expect(restaurants.length).toBeGreaterThan(0);
    expect(restaurants[0].id).toBeDefined();
  });

  it("finds a restaurant by id", () => {
    const restaurant = getRestaurantById("r1");

    expect(restaurant).toBeDefined();
    expect(restaurant?.name).toBe("Atelier Nord");
  });

  it("returns undefined for unknown id", () => {
    expect(getRestaurantById("missing")).toBeUndefined();
  });

  it("computes deterministic stats for a restaurant", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const stats1 = computeRestaurantStats(restaurant);
    const stats2 = computeRestaurantStats(restaurant);

    expect(stats1).toEqual(stats2);
    expect(stats1.covers).toBeGreaterThan(0);
    expect(stats1.trend).toBe("+12%");
  });

  it("sets a negative trend for under-performing restaurants", () => {
    const restaurant = getRestaurantById("r4");

    if (!restaurant) throw new Error("fixture missing");

    expect(computeRestaurantStats(restaurant).trend).toBe("−8%");
  });

  it("computes detailed stats with weekly and heatmap data", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const stats = computeRestaurantDetailedStats(restaurant);

    expect(stats.weeklyRevenue).toHaveLength(7);
    expect(stats.heatmap).toHaveLength(6);
    expect(stats.sparklineData).toHaveLength(24);
    expect(stats.topItems).toHaveLength(5);
    expect(stats.avgTicket).toBeGreaterThan(0);
  });

  it("lists customers deterministically", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const customers = listRestaurantCustomers(restaurant);

    expect(customers.length).toBe(8);
    expect(customers[0].name).toBeDefined();
    expect(["VIP", "Regular", "New"]).toContain(customers[0].tag);
  });

  it("lists orders with valid statuses", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const orders = listRestaurantOrders(restaurant);
    const validStatuses = ["new", "preparing", "ready", "served", "paid"];

    expect(orders.length).toBe(9);
    orders.forEach((o) => expect(validStatuses).toContain(o.status));
  });

  it("lists menu items with price and availability", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const items = listRestaurantMenuItems(restaurant);

    expect(items.length).toBe(9);
    expect(items[0].price).toBeGreaterThan(0);
  });

  it("returns restaurant settings with defaults", () => {
    const restaurant = getRestaurantById("r1");

    if (!restaurant) throw new Error("fixture missing");

    const settings = getRestaurantSettings(restaurant);

    expect(settings.name).toBe(restaurant.name);
    expect(settings.address).toBe(restaurant.address);
    expect(typeof settings.tableService).toBe("boolean");
  });
});
