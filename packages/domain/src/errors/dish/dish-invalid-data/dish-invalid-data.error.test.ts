import { describe, expect, test } from "vitest";

import { DishInvalidDataError } from "@/errors/dish/dish-invalid-data/dish-invalid-data.error";

describe("DishInvalidDataError", () => {
  test("should have name", () => {
    expect(new DishInvalidDataError("name", "x").name).toBe("DishInvalidDataError");
  });

  test("should include field and value", () => {
    expect(new DishInvalidDataError("name", "x").message).toBe("Invalid dish name: x");
  });
});
