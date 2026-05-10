import type { Dish } from "@/entities/dish/dish.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface IDishRepository {
  findById(id: DishId): Promise<Dish | null>;
  findManyByIds(ids: ReadonlyArray<DishId>): Promise<Dish[]>;
  findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Dish>>;
  save(dish: Dish): Promise<void>;
  delete(id: DishId): Promise<void>;
}
