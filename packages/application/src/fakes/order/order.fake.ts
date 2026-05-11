import type {
  ClientId,
  IOrderRepository,
  Order,
  OrderId,
  PaginatedResult,
  PaginationParams,
  RestaurantId
} from "@workspace/domain";

export class FakeOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.toString()) ?? null;
  }

  async findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Order>> {
    const all = Array.from(this.orders.values()).filter((o) => o.restaurantId.toString() === restaurantId.toString());

    return this.paginate(all, params);
  }

  async findByClient(clientId: ClientId, params: PaginationParams): Promise<PaginatedResult<Order>> {
    const all = Array.from(this.orders.values()).filter((o) => o.props.clientId?.toString() === clientId.toString());

    return this.paginate(all, params);
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.toString(), order);
  }

  async delete(id: OrderId): Promise<void> {
    this.orders.delete(id.toString());
  }

  private paginate(all: Order[], params: PaginationParams): PaginatedResult<Order> {
    const total = all.length;
    const offset = (params.page - 1) * params.limit;
    const data = all.slice(offset, offset + params.limit);

    return {
      data,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    };
  }
}
