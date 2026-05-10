import { describe, expect, test } from "vitest";

import { RestaurantInvalidSettingsError } from "@/errors/restaurant/restaurant-invalid-settings/restaurant-invalid-settings.error";

describe("RestaurantInvalidSettingsError", () => {
  test("should have name", () => {
    expect(new RestaurantInvalidSettingsError("").name).toBe("RestaurantInvalidSettingsError");
  });

  test("should include reason", () => {
    expect(new RestaurantInvalidSettingsError("maxCovers must be > 0").message).toBe("Invalid restaurant settings: maxCovers must be > 0");
  });
});
