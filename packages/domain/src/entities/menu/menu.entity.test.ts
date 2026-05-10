import { describe, expect, test } from "vitest";

import { Menu } from "@/entities/menu/menu.entity";
import { MenuInvalidDataError } from "@/errors/menu/menu-invalid-data/menu-invalid-data.error";
import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";

const restaurantId = RestaurantId.generate();
const dishA = DishId.generate();
const dishB = DishId.generate();

describe("Menu", () => {
  test("creates valid with dishes", () => {
    const m = Menu.create(restaurantId, {
      name: "Formule midi",
      description: "Entrée + plat",
      price: Money.fromCents(2500),
      isActive: true,
      dishIds: [dishA, dishB]
    });

    expect(m.props.dishIds).toHaveLength(2);
  });

  test("rejects duplicate dishes", () => {
    expect(() =>
      Menu.create(restaurantId, {
        name: "Formule midi",
        description: null,
        price: Money.fromCents(2500),
        isActive: true,
        dishIds: [dishA, dishA]
      })).toThrow(MenuInvalidDataError);
  });

  test("rejects too short name", () => {
    expect(() =>
      Menu.create(restaurantId, {
        name: "x",
        description: null,
        price: Money.fromCents(2500),
        isActive: true,
        dishIds: []
      })).toThrow(MenuInvalidDataError);
  });
});
