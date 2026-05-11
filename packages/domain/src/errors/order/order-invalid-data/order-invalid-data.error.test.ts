import { describe, expect, test } from "vitest";

import { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";

describe("OrderInvalidDataError", () => {
  test("should have name", () => {
    expect(new OrderInvalidDataError("quantity", 0).name).toBe("OrderInvalidDataError");
  });

  test("should include field and value", () => {
    expect(new OrderInvalidDataError("quantity", 0).message).toBe("Invalid order quantity: 0");
  });
});
