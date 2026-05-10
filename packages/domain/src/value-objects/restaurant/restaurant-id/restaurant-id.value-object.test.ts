import { describe, expect, test } from "vitest";

import { RestaurantInvalidIdError } from "@/errors/restaurant/restaurant-invalid-id/restaurant-invalid-id.error";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

describe("RestaurantId", () => {
  test("should create with value", () => {
    expect(RestaurantId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(RestaurantId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => RestaurantId.create("")).toThrow(RestaurantInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(RestaurantId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
