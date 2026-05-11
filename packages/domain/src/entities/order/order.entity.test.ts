import { describe, expect, test } from "vitest";

import { OrderItem } from "@/entities/order/order-item.entity";
import { Order, ORDER_STATUS } from "@/entities/order/order.entity";
import { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";
import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";

const restaurantId = RestaurantId.generate();
const PRICE_A = 1500;
const PRICE_B = 700;
const QTY_A = 2;

const buildItem = (cents: number, qty = 1): OrderItem =>
  OrderItem.create({
    ref: { kind: "dish", dishId: DishId.generate() },
    nameSnapshot: "Plat",
    unitPrice: Money.fromCents(cents),
    quantity: qty
  });

describe("Order", () => {
  test("creates valid with items", () => {
    const o = Order.create(restaurantId, {
      clientId: null,
      tableId: null,
      status: ORDER_STATUS.PENDING,
      notes: null,
      placedAt: new Date(),
      items: [buildItem(PRICE_A, QTY_A), buildItem(PRICE_B, 1)]
    });

    expect(o.total().toCents()).toBe(PRICE_A * QTY_A + PRICE_B);
  });

  test("rejects empty items", () => {
    expect(() =>
      Order.create(restaurantId, {
        clientId: null,
        tableId: null,
        status: ORDER_STATUS.PENDING,
        notes: null,
        placedAt: new Date(),
        items: []
      })).toThrow(OrderInvalidDataError);
  });

  test("changes status", () => {
    const o = Order.create(restaurantId, {
      clientId: null,
      tableId: null,
      status: ORDER_STATUS.PENDING,
      notes: null,
      placedAt: new Date(),
      items: [buildItem(1000)]
    });

    const o2 = o.changeStatus(ORDER_STATUS.PAID);

    expect(o2.props.status).toBe(ORDER_STATUS.PAID);
    expect(o2.id).toBe(o.id);
  });
});

describe("OrderItem", () => {
  test("rejects zero quantity", () => {
    expect(() =>
      OrderItem.create({
        ref: { kind: "dish", dishId: DishId.generate() },
        nameSnapshot: "X",
        unitPrice: Money.fromCents(100),
        quantity: 0
      })).toThrow(OrderInvalidDataError);
  });

  test("computes line total", () => {
    const item = buildItem(450, 3);

    expect(item.lineTotal().toCents()).toBe(1350);
  });
});
