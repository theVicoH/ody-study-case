import { describe, expect, test } from "vitest";

import { ClientNotFoundError } from "@/errors/client/client-not-found/client-not-found.error";

describe("ClientNotFoundError", () => {
  test("should have name", () => {
    expect(new ClientNotFoundError("x").name).toBe("ClientNotFoundError");
  });

  test("should include id", () => {
    expect(new ClientNotFoundError("xxx").message).toBe("Client not found: xxx");
  });
});
