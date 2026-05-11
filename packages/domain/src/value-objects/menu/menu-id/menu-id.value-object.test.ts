import { describe, expect, test } from "vitest";

import { MenuInvalidIdError } from "@/errors/menu/menu-invalid-id/menu-invalid-id.error";
import { MenuId } from "@/value-objects/menu/menu-id/menu-id.value-object";

describe("MenuId", () => {
  test("should create with value", () => {
    expect(MenuId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(MenuId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => MenuId.create("")).toThrow(MenuInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(MenuId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
