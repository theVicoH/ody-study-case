import { describe, expect, test } from "vitest";

import { ClientInvalidDataError } from "@/errors/client/client-invalid-data/client-invalid-data.error";

describe("ClientInvalidDataError", () => {
  test("should have name", () => {
    expect(new ClientInvalidDataError("name", "x").name).toBe("ClientInvalidDataError");
  });

  test("should include field and value", () => {
    expect(new ClientInvalidDataError("name", "x").message).toBe("Invalid client name: x");
  });
});
