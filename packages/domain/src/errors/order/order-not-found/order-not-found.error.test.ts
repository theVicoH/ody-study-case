import { describe, expect, test } from "vitest";

import { OrderNotFoundError } from "@/errors/order/order-not-found/order-not-found.error";

describe("OrderNotFoundError", () => {
  test("should have name", () => {
    expect(new OrderNotFoundError("x").name).toBe("OrderNotFoundError");
  });

  test("should include id", () => {
    expect(new OrderNotFoundError("xxx").message).toBe("Order not found: xxx");
  });
});
