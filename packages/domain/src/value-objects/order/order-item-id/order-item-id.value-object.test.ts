import { describe, expect, test } from "vitest";

import { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";
import { OrderItemId } from "@/value-objects/order/order-item-id/order-item-id.value-object";

describe("OrderItemId", () => {
  test("should create with value", () => {
    expect(OrderItemId.create("abc").toString()).toBe("abc");
  });

  test("should trim", () => {
    expect(OrderItemId.create(" abc ").toString()).toBe("abc");
  });

  test("should throw on empty", () => {
    expect(() => OrderItemId.create("")).toThrow(OrderInvalidIdError);
  });

  test("should generate UUID", () => {
    expect(OrderItemId.generate().toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
