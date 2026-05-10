import { describe, expect, test } from "vitest";

import { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";
import { OrderId } from "@/value-objects/order/order-id/order-id.value-object";

describe("OrderId", () => {
  test("should create with value", () => {
    expect(OrderId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(OrderId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => OrderId.create("")).toThrow(OrderInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(OrderId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
