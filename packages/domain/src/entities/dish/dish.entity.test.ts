import { describe, expect, test } from "vitest";

import { Dish } from "@/entities/dish/dish.entity";
import { DishInvalidDataError } from "@/errors/dish/dish-invalid-data/dish-invalid-data.error";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";

const restaurantId = RestaurantId.generate();
const baseProps = {
  name: "Tartare de boeuf",
  description: null,
  price: Money.fromCents(1800),
  category: "main",
  imageUrl: null,
  isActive: true
};

describe("Dish", () => {
  test("creates valid", () => {
    const d = Dish.create(restaurantId, baseProps);

    expect(d.props.name).toBe("Tartare de boeuf");
    expect(d.props.price.toCents()).toBe(1800);
  });

  test("rejects too short name", () => {
    expect(() => Dish.create(restaurantId, { ...baseProps, name: "x" })).toThrow(DishInvalidDataError);
  });

  test("rejects unknown category", () => {
    expect(() => Dish.create(restaurantId, { ...baseProps, category: "weird" })).toThrow(DishInvalidDataError);
  });

  test("normalizes category to lowercase", () => {
    const d = Dish.create(restaurantId, { ...baseProps, category: "MAIN" });

    expect(d.props.category).toBe("main");
  });
});
