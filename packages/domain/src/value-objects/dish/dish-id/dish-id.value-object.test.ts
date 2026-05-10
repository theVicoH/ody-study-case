import { describe, expect, test } from "vitest";

import { DishInvalidIdError } from "@/errors/dish/dish-invalid-id/dish-invalid-id.error";
import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";

describe("DishId", () => {
  test("should create with value", () => {
    expect(DishId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(DishId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => DishId.create("")).toThrow(DishInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(DishId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
