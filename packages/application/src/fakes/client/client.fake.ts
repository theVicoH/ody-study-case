import type {
  Client,
  ClientId,
  IClientRepository,
  PaginatedResult,
  PaginationParams,
  RestaurantId
} from "@workspace/domain";

export class FakeClientRepository implements IClientRepository {
  private clients: Map<string, Client> = new Map();

  async findById(id: ClientId): Promise<Client | null> {
    return this.clients.get(id.toString()) ?? null;
  }

  async findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Client>> {
    const all = Array.from(this.clients.values()).filter(
      (c) => c.restaurantId.toString() === restaurantId.toString()
    );

    return this.paginate(all, params);
  }

  async save(client: Client): Promise<void> {
    this.clients.set(client.id.toString(), client);
  }

  async delete(id: ClientId): Promise<void> {
    this.clients.delete(id.toString());
  }

  private paginate(all: Client[], params: PaginationParams): PaginatedResult<Client> {
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
