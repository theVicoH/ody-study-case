import { randomUUID } from "crypto";

import { DishInvalidIdError } from "@/errors/dish/dish-invalid-id/dish-invalid-id.error";

export class DishId {
  private constructor(private readonly value: string) {}

  static create(value: string): DishId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new DishInvalidIdError(value);
    }

    return new DishId(trimmed);
  }

  static generate(): DishId {
    return new DishId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
