import type { Menu } from "@/entities/menu/menu.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { MenuId } from "@/value-objects/menu/menu-id/menu-id.value-object";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface IMenuRepository {
  findById(id: MenuId): Promise<Menu | null>;
  findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Menu>>;
  save(menu: Menu): Promise<void>;
  delete(id: MenuId): Promise<void>;
}
