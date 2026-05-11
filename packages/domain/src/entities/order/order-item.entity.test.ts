import { describe, expect, test } from "vitest";

import { OrderItem } from "@/entities/order/order-item.entity";
import { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";
import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";

describe("OrderItem", () => {
  const baseProps = {
    ref: { kind: "dish", dishId: DishId.create("d1") } as const,
    nameSnapshot: "Pizza",
    unitPrice: Money.fromCents(1000),
    quantity: 2
  };

  test("should create with generated id", () => {
    const item = OrderItem.create(baseProps);

    expect(item.id.toString()).toMatch(/^[0-9a-f-]{36}$/i);
    expect(item.props.nameSnapshot).toBe("Pizza");
  });

  test("should compute lineTotal", () => {
    const item = OrderItem.create(baseProps);

    expect(item.lineTotal().toCents()).toBe(2000);
  });

  test("should throw on invalid quantity", () => {
    expect(() => OrderItem.create({ ...baseProps, quantity: 0 })).toThrow(OrderInvalidDataError);
  });

  test("should throw on empty nameSnapshot", () => {
    expect(() => OrderItem.create({ ...baseProps, nameSnapshot: "  " })).toThrow(OrderInvalidDataError);
  });
});
