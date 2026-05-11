import { describe, expect, test } from "vitest";

import { DishNotFoundError } from "@/errors/dish/dish-not-found/dish-not-found.error";

describe("DishNotFoundError", () => {
  test("should have name", () => {
    expect(new DishNotFoundError("x").name).toBe("DishNotFoundError");
  });

  test("should include id", () => {
    expect(new DishNotFoundError("xxx").message).toBe("Dish not found: xxx");
  });
});
