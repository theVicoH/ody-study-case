import { describe, expect, test } from "vitest";

import { MenuInvalidDataError } from "@/errors/menu/menu-invalid-data/menu-invalid-data.error";

describe("MenuInvalidDataError", () => {
  test("should have name", () => {
    expect(new MenuInvalidDataError("name", "x").name).toBe("MenuInvalidDataError");
  });

  test("should include field and value", () => {
    expect(new MenuInvalidDataError("name", "x").message).toBe("Invalid menu name: x");
  });
});
