import { describe, expect, test } from "vitest";

import { MenuNotFoundError } from "@/errors/menu/menu-not-found/menu-not-found.error";

describe("MenuNotFoundError", () => {
  test("should have name", () => {
    expect(new MenuNotFoundError("x").name).toBe("MenuNotFoundError");
  });

  test("should include id", () => {
    expect(new MenuNotFoundError("xxx").message).toBe("Menu not found: xxx");
  });
});
