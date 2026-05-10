import type { Order } from "@/entities/order/order.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { ClientId } from "@/value-objects/client/client-id/client-id.value-object";
import type { OrderId } from "@/value-objects/order/order-id/order-id.value-object";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Order>>;
  findByClient(clientId: ClientId, params: PaginationParams): Promise<PaginatedResult<Order>>;
  save(order: Order): Promise<void>;
  delete(id: OrderId): Promise<void>;
}
