import { menuDishesTable, menusTable } from "@workspace/database";
import { DishId, Menu, MenuId, Money, RestaurantId } from "@workspace/domain";
import { count, eq, inArray } from "drizzle-orm";

import type { Database, MenuRow } from "@workspace/database";
import type { IMenuRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleMenuRepository implements IMenuRepository {
  constructor(private readonly db: Database) {}

  async findById(id: MenuId): Promise<Menu | null> {
    const [row] = await this.db
      .select()
      .from(menusTable)
      .where(eq(menusTable.id, id.toString()))
      .limit(1);

    if (!row) return null;

    const dishLinks = await this.db
      .select()
      .from(menuDishesTable)
      .where(eq(menuDishesTable.menuId, row.id))
      .orderBy(menuDishesTable.position);

    return this.toEntity(row, dishLinks.map((l) => l.dishId));
  }

  async findByRestaurant(
    restaurantId: RestaurantId,
    params: PaginationParams
  ): Promise<PaginatedResult<Menu>> {
    const offset = (params.page - 1) * params.limit;
    const where = eq(menusTable.restaurantId, restaurantId.toString());
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(menusTable).where(where).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(menusTable).where(where)
    ]);
    const totalNum = Number(total);
    const ids = rows.map((r) => r.id);
    const links = ids.length
      ? await this.db
          .select()
          .from(menuDishesTable)
          .where(inArray(menuDishesTable.menuId, ids))
          .orderBy(menuDishesTable.position)
      : [];

    const dishesByMenu = new Map<string, string[]>();

    for (const link of links) {
      const arr = dishesByMenu.get(link.menuId) ?? [];

      arr.push(link.dishId);
      dishesByMenu.set(link.menuId, arr);
    }

    return {
      data: rows.map((r) => this.toEntity(r, dishesByMenu.get(r.id) ?? [])),
      total: totalNum,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(totalNum / params.limit)
    };
  }

  async save(menu: Menu): Promise<void> {
    const id = menu.id.toString();
    const values = {
      id,
      restaurantId: menu.restaurantId.toString(),
      name: menu.props.name,
      description: menu.props.description,
      priceCents: menu.props.price.toCents(),
      isActive: menu.props.isActive,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt
    };

    await this.db.transaction(async (tx) => {
      await tx
        .insert(menusTable)
        .values(values)
        .onConflictDoUpdate({
          target: menusTable.id,
          set: {
            name: values.name,
            description: values.description,
            priceCents: values.priceCents,
            isActive: values.isActive,
            updatedAt: values.updatedAt
          }
        });

      await tx.delete(menuDishesTable).where(eq(menuDishesTable.menuId, id));

      if (menu.props.dishIds.length > 0) {
        await tx.insert(menuDishesTable).values(
          menu.props.dishIds.map((dishId, index) => ({
            menuId: id,
            dishId: dishId.toString(),
            position: index
          }))
        );
      }
    });
  }

  async delete(id: MenuId): Promise<void> {
    await this.db.delete(menusTable).where(eq(menusTable.id, id.toString()));
  }

  private toEntity(row: MenuRow, dishIds: string[]): Menu {
    return Menu.reconstitute(
      MenuId.create(row.id),
      RestaurantId.create(row.restaurantId),
      {
        name: row.name,
        description: row.description,
        price: Money.fromCents(row.priceCents),
        isActive: row.isActive,
        dishIds: dishIds.map((d) => DishId.create(d))
      },
      row.createdAt,
      row.updatedAt
    );
  }
}
