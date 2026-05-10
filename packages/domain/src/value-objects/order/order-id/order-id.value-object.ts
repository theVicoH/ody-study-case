import { randomUUID } from "crypto";

import { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";

export class OrderId {
  private constructor(private readonly value: string) {}

  static create(value: string): OrderId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new OrderInvalidIdError(value);
    }

    return new OrderId(trimmed);
  }

  static generate(): OrderId {
    return new OrderId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
