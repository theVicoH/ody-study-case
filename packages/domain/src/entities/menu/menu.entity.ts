import { MenuInvalidDataError } from "@/errors/menu/menu-invalid-data/menu-invalid-data.error";

import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import { MenuId } from "@/value-objects/menu/menu-id/menu-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface MenuProps {
  name: string;
  description: string | null;
  price: Money;
  isActive: boolean;
  dishIds: ReadonlyArray<DishId>;
}

const NAME_MIN = 2;
const NAME_MAX = 120;

const validate = (props: MenuProps): MenuProps => {
  const name = props.name.trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    throw new MenuInvalidDataError("name", props.name);
  }

  const description = props.description?.trim() || null;

  const seen = new Set<string>();

  for (const dishId of props.dishIds) {
    const value = dishId.toString();

    if (seen.has(value)) {
      throw new MenuInvalidDataError("dishIds", "duplicate dish");
    }

    seen.add(value);
  }

  return { name, description, price: props.price, isActive: props.isActive, dishIds: props.dishIds };
};

export class Menu {
  private constructor(
    public readonly id: MenuId,
    public readonly restaurantId: RestaurantId,
    public readonly props: MenuProps,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(restaurantId: RestaurantId, props: MenuProps): Menu {
    const now = new Date();

    return new Menu(MenuId.generate(), restaurantId, validate(props), now, now);
  }

  static reconstitute(
    id: MenuId,
    restaurantId: RestaurantId,
    props: MenuProps,
    createdAt: Date,
    updatedAt: Date
  ): Menu {
    return new Menu(id, restaurantId, props, createdAt, updatedAt);
  }

  update(props: MenuProps): Menu {
    return new Menu(this.id, this.restaurantId, validate(props), this.createdAt, new Date());
  }
}
