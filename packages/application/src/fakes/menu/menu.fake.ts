import type {
  IMenuRepository,
  Menu,
  MenuId,
  PaginatedResult,
  PaginationParams,
  RestaurantId
} from "@workspace/domain";

export class FakeMenuRepository implements IMenuRepository {
  private menus: Map<string, Menu> = new Map();

  async findById(id: MenuId): Promise<Menu | null> {
    return this.menus.get(id.toString()) ?? null;
  }

  async findByRestaurant(restaurantId: RestaurantId, params: PaginationParams): Promise<PaginatedResult<Menu>> {
    const all = Array.from(this.menus.values()).filter(
      (m) => m.restaurantId.toString() === restaurantId.toString()
    );

    return this.paginate(all, params);
  }

  async save(menu: Menu): Promise<void> {
    this.menus.set(menu.id.toString(), menu);
  }

  async delete(id: MenuId): Promise<void> {
    this.menus.delete(id.toString());
  }

  private paginate(all: Menu[], params: PaginationParams): PaginatedResult<Menu> {
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
