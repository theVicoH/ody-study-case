import { describe, expect, test } from "vitest";

import { ClientInvalidIdError } from "@/errors/client/client-invalid-id/client-invalid-id.error";

describe("ClientInvalidIdError", () => {
  test("should have name", () => {
    expect(new ClientInvalidIdError("").name).toBe("ClientInvalidIdError");
  });

  test("should include id", () => {
    expect(new ClientInvalidIdError("xxx").message).toBe("Invalid client id: xxx");
  });
});
