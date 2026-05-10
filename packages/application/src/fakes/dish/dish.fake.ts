import type {
  Dish,
  DishId,
  IDishRepository,
  PaginatedResult,
  PaginationParams,
  RestaurantId
} from "@workspace/domain";

export class FakeDishRepository implements IDishRepository {
  private dishes: Map<string, Dish> = new Map();

  async findById(id: DishId): Promise<Dish | null> {
    return this.dishes.get(id.toString()) ?? null;
  }

  async findManyByIds(ids: ReadonlyArray<DishId>): Promise<Dish[]> {
    const set = new Set(ids.map((id) => id.toString()));

    return Array.from(this.dishes.values()).filter((d) => set.has(d.id.toString()));
  }

  async findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Dish>> {
    const all = Array.from(this.dishes.values()).filter(
      (d) => d.restaurantId.toString() === restaurantId.toString()
    );

    return this.paginate(all, params);
  }

  async save(dish: Dish): Promise<void> {
    this.dishes.set(dish.id.toString(), dish);
  }

  async delete(id: DishId): Promise<void> {
    this.dishes.delete(id.toString());
  }

  private paginate(all: Dish[], params: PaginationParams): PaginatedResult<Dish> {
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
