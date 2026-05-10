import { RestaurantInvalidNameError } from "@/errors/restaurant/restaurant-invalid-name/restaurant-invalid-name.error";

const MIN_LENGTH = 2;
const MAX_LENGTH = 80;

export class RestaurantName {
  private constructor(private readonly value: string) {}

  static create(value: string): RestaurantName {
    const trimmed = value?.trim() ?? "";

    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new RestaurantInvalidNameError(value);
    }

    return new RestaurantName(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
