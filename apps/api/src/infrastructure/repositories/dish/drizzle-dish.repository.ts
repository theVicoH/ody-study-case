import { dishesTable } from "@workspace/database";
import { Dish, DishId, Money, RestaurantId } from "@workspace/domain";
import { count, eq, inArray } from "drizzle-orm";

import type { Database, DishRow } from "@workspace/database";
import type { IDishRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleDishRepository implements IDishRepository {
  constructor(private readonly db: Database) {}

  async findById(id: DishId): Promise<Dish | null> {
    const [row] = await this.db
      .select()
      .from(dishesTable)
      .where(eq(dishesTable.id, id.toString()))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findManyByIds(ids: ReadonlyArray<DishId>): Promise<Dish[]> {
    if (ids.length === 0) return [];

    const rows = await this.db
      .select()
      .from(dishesTable)
      .where(inArray(dishesTable.id, ids.map((id) => id.toString())));

    return rows.map((r) => this.toEntity(r));
  }

  async findByRestaurant(
    restaurantId: RestaurantId,
    params: PaginationParams
  ): Promise<PaginatedResult<Dish>> {
    const offset = (params.page - 1) * params.limit;
    const where = eq(dishesTable.restaurantId, restaurantId.toString());
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(dishesTable).where(where).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(dishesTable).where(where)
    ]);
    const totalNum = Number(total);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: totalNum,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(totalNum / params.limit)
    };
  }

  async save(dish: Dish): Promise<void> {
    const values = {
      id: dish.id.toString(),
      restaurantId: dish.restaurantId.toString(),
      name: dish.props.name,
      description: dish.props.description,
      priceCents: dish.props.price.toCents(),
      category: dish.props.category,
      isActive: dish.props.isActive,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt
    };

    await this.db
      .insert(dishesTable)
      .values(values)
      .onConflictDoUpdate({
        target: dishesTable.id,
        set: {
          name: values.name,
          description: values.description,
          priceCents: values.priceCents,
          category: values.category,
          isActive: values.isActive,
          updatedAt: values.updatedAt
        }
      });
  }

  async delete(id: DishId): Promise<void> {
    await this.db.delete(dishesTable).where(eq(dishesTable.id, id.toString()));
  }

  private toEntity(row: DishRow): Dish {
    return Dish.reconstitute(
      DishId.create(row.id),
      RestaurantId.create(row.restaurantId),
      {
        name: row.name,
        description: row.description,
        price: Money.fromCents(row.priceCents),
        category: row.category,
        isActive: row.isActive
      },
      row.createdAt,
      row.updatedAt
    );
  }
}
