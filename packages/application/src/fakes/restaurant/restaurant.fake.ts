import type { IRestaurantRepository, OrganizationId, PaginatedResult, PaginationParams, Restaurant, RestaurantId } from "@workspace/domain";

export class FakeRestaurantRepository implements IRestaurantRepository {
  private restaurants: Map<string, Restaurant> = new Map();

  async findById(id: RestaurantId): Promise<Restaurant | null> {
    return this.restaurants.get(id.toString()) ?? null;
  }

  async findByOrganization(organizationId: OrganizationId, params: PaginationParams): Promise<PaginatedResult<Restaurant>> {
    const all = Array.from(this.restaurants.values()).filter((r) => r.organizationId.toString() === organizationId.toString());

    return this.paginate(all, params);
  }

  async save(restaurant: Restaurant): Promise<void> {
    this.restaurants.set(restaurant.id.toString(), restaurant);
  }

  async delete(id: RestaurantId): Promise<void> {
    this.restaurants.delete(id.toString());
  }

  getAll(): Restaurant[] {
    return Array.from(this.restaurants.values());
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Restaurant>> {
    return this.paginate(Array.from(this.restaurants.values()), params);
  }

  private paginate(all: Restaurant[], params: PaginationParams): PaginatedResult<Restaurant> {
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
