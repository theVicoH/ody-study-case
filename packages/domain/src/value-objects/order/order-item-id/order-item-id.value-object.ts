import { randomUUID } from "crypto";

import { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";

export class OrderItemId {
  private constructor(private readonly value: string) {}

  static create(value: string): OrderItemId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new OrderInvalidIdError(value);
    }

    return new OrderItemId(trimmed);
  }

  static generate(): OrderItemId {
    return new OrderItemId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
