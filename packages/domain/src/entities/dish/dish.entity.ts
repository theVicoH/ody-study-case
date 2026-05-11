import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";
import type { Money } from "@/value-objects/shared/money/money.value-object";

import { DishInvalidDataError } from "@/errors/dish/dish-invalid-data/dish-invalid-data.error";
import { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";

export interface DishProps {
  name: string;
  description: string | null;
  price: Money;
  category: string;
  imageUrl: string | null;
  isActive: boolean;
}

const NAME_MIN = 2;
const NAME_MAX = 120;
const ALLOWED_CATEGORIES = new Set(["starter", "main", "dessert", "drink", "side", "other"]);

const validate = (props: DishProps): DishProps => {
  const name = props.name.trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    throw new DishInvalidDataError("name", props.name);
  }

  const category = props.category.trim().toLowerCase();

  if (!ALLOWED_CATEGORIES.has(category)) {
    throw new DishInvalidDataError("category", props.category);
  }

  const description = props.description?.trim() || null;
  const imageUrl = props.imageUrl?.trim() || null;

  return { name, description, price: props.price, category, imageUrl, isActive: props.isActive };
};

export class Dish {
  private constructor(
    public readonly id: DishId,
    public readonly restaurantId: RestaurantId,
    public readonly props: DishProps,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(restaurantId: RestaurantId, props: DishProps): Dish {
    const now = new Date();

    return new Dish(DishId.generate(), restaurantId, validate(props), now, now);
  }

  static reconstitute(
    id: DishId,
    restaurantId: RestaurantId,
    props: DishProps,
    createdAt: Date,
    updatedAt: Date
  ): Dish {
    return new Dish(id, restaurantId, props, createdAt, updatedAt);
  }

  update(props: DishProps): Dish {
    return new Dish(this.id, this.restaurantId, validate(props), this.createdAt, new Date());
  }
}
