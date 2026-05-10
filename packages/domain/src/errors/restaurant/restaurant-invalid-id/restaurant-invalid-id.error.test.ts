import { describe, expect, test } from "vitest";

import { RestaurantInvalidIdError } from "@/errors/restaurant/restaurant-invalid-id/restaurant-invalid-id.error";

describe("RestaurantInvalidIdError", () => {
  test("should have name", () => {
    const error = new RestaurantInvalidIdError("");

    expect(error.name).toBe("RestaurantInvalidIdError");
  });

  test("should include id", () => {
    expect(new RestaurantInvalidIdError("xxx").message).toBe("Invalid restaurant id: xxx");
  });
});
