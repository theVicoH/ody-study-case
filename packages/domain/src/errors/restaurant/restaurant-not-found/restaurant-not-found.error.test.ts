import { describe, expect, test } from "vitest";

import { RestaurantNotFoundError } from "@/errors/restaurant/restaurant-not-found/restaurant-not-found.error";

describe("RestaurantNotFoundError", () => {
  test("should have name", () => {
    expect(new RestaurantNotFoundError("a").name).toBe("RestaurantNotFoundError");
  });

  test("should include id", () => {
    expect(new RestaurantNotFoundError("a").message).toBe("Restaurant not found: a");
  });
});
