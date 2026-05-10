import type { Restaurant } from "@/entities/restaurant/restaurant.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface IRestaurantRepository {
  findById(id: RestaurantId): Promise<Restaurant | null>;
  findByOrganization(organizationId: OrganizationId, params: PaginationParams): Promise<PaginatedResult<Restaurant>>;
  save(restaurant: Restaurant): Promise<void>;
  delete(id: RestaurantId): Promise<void>;
  findAll(params: PaginationParams): Promise<PaginatedResult<Restaurant>>;
}
