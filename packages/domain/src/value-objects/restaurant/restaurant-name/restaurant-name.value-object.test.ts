import { describe, expect, test } from "vitest";

import { RestaurantInvalidNameError } from "@/errors/restaurant/restaurant-invalid-name/restaurant-invalid-name.error";
import { RestaurantName } from "@/value-objects/restaurant/restaurant-name/restaurant-name.value-object";

describe("RestaurantName", () => {
  test("should create", () => {
    expect(RestaurantName.create("Le Gourmet").toString()).toBe("Le Gourmet");
  });

  test("should trim", () => {
    expect(RestaurantName.create("  Foo  ").toString()).toBe("Foo");
  });

  test("should throw on too short", () => {
    expect(() => RestaurantName.create("A")).toThrow(RestaurantInvalidNameError);
  });

  test("should throw on too long", () => {
    expect(() => RestaurantName.create("a".repeat(81))).toThrow(RestaurantInvalidNameError);
  });
});
