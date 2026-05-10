import { describe, expect, test } from "vitest";

import { ClientInvalidIdError } from "@/errors/client/client-invalid-id/client-invalid-id.error";
import { ClientId } from "@/value-objects/client/client-id/client-id.value-object";

describe("ClientId", () => {
  test("should create with value", () => {
    expect(ClientId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(ClientId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => ClientId.create("")).toThrow(ClientInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(ClientId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
