import { restaurantsTable } from "@workspace/database";
import { OrganizationId, Restaurant, RestaurantId, RestaurantName, RestaurantSettings } from "@workspace/domain";
import { count, eq } from "drizzle-orm";

import type { Database, RestaurantRow } from "@workspace/database";
import type { IRestaurantRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleRestaurantRepository implements IRestaurantRepository {
  constructor(private readonly db: Database) {}

  async findById(id: RestaurantId): Promise<Restaurant | null> {
    const [row] = await this.db
      .select()
      .from(restaurantsTable)
      .where(eq(restaurantsTable.id, id.toString()))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findByOrganization(
    organizationId: OrganizationId,
    params: PaginationParams
  ): Promise<PaginatedResult<Restaurant>> {
    const offset = (params.page - 1) * params.limit;
    const where = eq(restaurantsTable.organizationId, organizationId.toString());
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(restaurantsTable).where(where).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(restaurantsTable).where(where)
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: Number(total),
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(Number(total) / params.limit)
    };
  }

  async save(restaurant: Restaurant): Promise<void> {
    const settings = restaurant.settings;

    await this.db
      .insert(restaurantsTable)
      .values({
        id: restaurant.id.toString(),
        organizationId: restaurant.organizationId.toString(),
        name: restaurant.name.toString(),
        address: settings.address,
        phone: settings.phone,
        maxCovers: settings.maxCovers,
        tableService: settings.tableService,
        clickAndCollect: settings.clickAndCollect,
        kitchenNotifications: settings.kitchenNotifications,
        testMode: settings.testMode,
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt
      })
      .onConflictDoUpdate({
        target: restaurantsTable.id,
        set: {
          name: restaurant.name.toString(),
          address: settings.address,
          phone: settings.phone,
          maxCovers: settings.maxCovers,
          tableService: settings.tableService,
          clickAndCollect: settings.clickAndCollect,
          kitchenNotifications: settings.kitchenNotifications,
          testMode: settings.testMode,
          updatedAt: restaurant.updatedAt
        }
      });
  }

  async delete(id: RestaurantId): Promise<void> {
    await this.db.delete(restaurantsTable).where(eq(restaurantsTable.id, id.toString()));
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Restaurant>> {
    const offset = (params.page - 1) * params.limit;
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(restaurantsTable).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(restaurantsTable)
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: Number(total),
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(Number(total) / params.limit)
    };
  }

  private toEntity(row: RestaurantRow): Restaurant {
    return Restaurant.reconstitute(
      RestaurantId.create(row.id),
      OrganizationId.create(row.organizationId),
      RestaurantName.create(row.name),
      RestaurantSettings.create({
        address: row.address,
        phone: row.phone,
        maxCovers: row.maxCovers,
        tableService: row.tableService,
        clickAndCollect: row.clickAndCollect,
        kitchenNotifications: row.kitchenNotifications,
        testMode: row.testMode
      }),
      row.updatedAt,
      row.createdAt
    );
  }
}
