import { describe, expect, test } from "vitest";

import { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";

describe("OrderInvalidIdError", () => {
  test("should have name", () => {
    expect(new OrderInvalidIdError("").name).toBe("OrderInvalidIdError");
  });

  test("should include id", () => {
    expect(new OrderInvalidIdError("xxx").message).toBe("Invalid order id: xxx");
  });
});
