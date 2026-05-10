import { randomUUID } from "crypto";

import { RestaurantInvalidIdError } from "@/errors/restaurant/restaurant-invalid-id/restaurant-invalid-id.error";

export class RestaurantId {
  private constructor(private readonly value: string) {}

  static create(value: string): RestaurantId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new RestaurantInvalidIdError(value);
    }

    return new RestaurantId(trimmed);
  }

  static generate(): RestaurantId {
    return new RestaurantId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
