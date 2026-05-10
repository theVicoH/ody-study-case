import { describe, expect, test } from "vitest";

import { RestaurantInvalidNameError } from "@/errors/restaurant/restaurant-invalid-name/restaurant-invalid-name.error";

describe("RestaurantInvalidNameError", () => {
  test("should have name", () => {
    const error = new RestaurantInvalidNameError("");

    expect(error.name).toBe("RestaurantInvalidNameError");
  });

  test("should include name", () => {
    expect(new RestaurantInvalidNameError("x").message).toBe("Invalid restaurant name: x");
  });
});
