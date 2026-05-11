import { describe, expect, test } from "vitest";

import { DishInvalidIdError } from "@/errors/dish/dish-invalid-id/dish-invalid-id.error";

describe("DishInvalidIdError", () => {
  test("should have name", () => {
    expect(new DishInvalidIdError("").name).toBe("DishInvalidIdError");
  });

  test("should include id", () => {
    expect(new DishInvalidIdError("xxx").message).toBe("Invalid dish id: xxx");
  });
});
