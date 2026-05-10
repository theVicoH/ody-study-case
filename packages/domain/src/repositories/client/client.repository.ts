import type { Client } from "@/entities/client/client.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { ClientId } from "@/value-objects/client/client-id/client-id.value-object";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface IClientRepository {
  findById(id: ClientId): Promise<Client | null>;
  findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Client>>;
  save(client: Client): Promise<void>;
  delete(id: ClientId): Promise<void>;
}
