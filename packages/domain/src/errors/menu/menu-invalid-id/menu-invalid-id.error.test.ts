import { describe, expect, test } from "vitest";

import { MenuInvalidIdError } from "@/errors/menu/menu-invalid-id/menu-invalid-id.error";

describe("MenuInvalidIdError", () => {
  test("should have name", () => {
    expect(new MenuInvalidIdError("").name).toBe("MenuInvalidIdError");
  });

  test("should include id", () => {
    expect(new MenuInvalidIdError("xxx").message).toBe("Invalid menu id: xxx");
  });
});
