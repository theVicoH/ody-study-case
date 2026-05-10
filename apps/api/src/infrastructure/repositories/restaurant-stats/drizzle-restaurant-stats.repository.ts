import {
  clientsTable,
  dishesTable,
  orderItemsTable,
  ordersTable,
  restaurantTablesTable
} from "@workspace/database";
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";

import type { Database } from "@workspace/database";
import type {
  IRestaurantStatsRepository,
  OrderStatus,
  RestaurantId,
  RestaurantStatsRawData,
  StatsOrderInput,
  StatsOrderItemInput
} from "@workspace/domain";

type ItemRow = {
  orderId: string;
  refKind: "menu" | "dish";
  refId: string;
  nameSnapshot: string;
  category: string;
  unitPriceCents: number;
  quantity: number;
};

const TABLE_OCCUPIED = "occupied";

export class DrizzleRestaurantStatsRepository implements IRestaurantStatsRepository {
  constructor(private readonly db: Database) {}

  async loadRawData(restaurantId: RestaurantId, since: Date): Promise<RestaurantStatsRawData> {
    return this.loadFor([restaurantId.toString()], since);
  }

  async loadRawDataForMany(
    restaurantIds: ReadonlyArray<RestaurantId>,
    since: Date
  ): Promise<RestaurantStatsRawData> {
    if (restaurantIds.length === 0) {
      return { orders: [], totalTables: 0, occupiedTables: 0, clientCount: 0 };
    }

    return this.loadFor(restaurantIds.map((id) => id.toString()), since);
  }

  private async loadFor(restaurantIds: string[], since: Date): Promise<RestaurantStatsRawData> {
    const ordersWhere = and(inArray(ordersTable.restaurantId, restaurantIds), gte(ordersTable.placedAt, since));

    const [orderRows, tableCounts, clientCounts] = await Promise.all([
      this.db
        .select({
          id: ordersTable.id,
          placedAt: ordersTable.placedAt,
          totalCents: ordersTable.totalCents,
          status: ordersTable.status
        })
        .from(ordersTable)
        .where(ordersWhere),
      this.db
        .select({
          status: restaurantTablesTable.status,
          value: count()
        })
        .from(restaurantTablesTable)
        .where(and(inArray(restaurantTablesTable.restaurantId, restaurantIds), eq(restaurantTablesTable.isActive, true)))
        .groupBy(restaurantTablesTable.status),
      this.db
        .select({ value: count() })
        .from(clientsTable)
        .where(inArray(clientsTable.restaurantId, restaurantIds))
    ]);

    const orderIds = orderRows.map((r) => r.id);
    const itemRows = orderIds.length > 0 ? await this.fetchItems(orderIds) : [];
    const itemsByOrder = new Map<string, StatsOrderItemInput[]>();

    for (const row of itemRows) {
      const arr = itemsByOrder.get(row.orderId) ?? [];

      arr.push({
        refKind: row.refKind,
        refId: row.refId,
        nameSnapshot: row.nameSnapshot,
        category: row.category,
        unitPriceCents: row.unitPriceCents,
        quantity: row.quantity
      });
      itemsByOrder.set(row.orderId, arr);
    }

    const orders: StatsOrderInput[] = orderRows.map((row) => ({
      placedAt: row.placedAt,
      totalCents: row.totalCents,
      status: row.status as OrderStatus,
      items: itemsByOrder.get(row.id) ?? []
    }));

    let totalTables = 0;
    let occupiedTables = 0;

    for (const tc of tableCounts) {
      const value = Number(tc.value);

      totalTables += value;
      if (tc.status === TABLE_OCCUPIED) occupiedTables += value;
    }

    const clientCount = Number(clientCounts[0]?.value ?? 0);

    return { orders, totalTables, occupiedTables, clientCount };
  }

  private async fetchItems(orderIds: string[]): Promise<ItemRow[]> {
    const rows = await this.db
      .select({
        orderId: orderItemsTable.orderId,
        menuId: orderItemsTable.menuId,
        dishId: orderItemsTable.dishId,
        nameSnapshot: orderItemsTable.nameSnapshot,
        unitPriceCents: orderItemsTable.unitPriceCents,
        quantity: orderItemsTable.quantity,
        category: sql<string | null>`${dishesTable.category}`
      })
      .from(orderItemsTable)
      .leftJoin(dishesTable, eq(orderItemsTable.dishId, dishesTable.id))
      .where(inArray(orderItemsTable.orderId, orderIds));

    return rows.map((r) => {
      const isDish = r.dishId !== null;

      return {
        orderId: r.orderId,
        refKind: isDish ? "dish" : "menu",
        refId: (isDish ? r.dishId : r.menuId) ?? "",
        nameSnapshot: r.nameSnapshot,
        category: r.category ?? "",
        unitPriceCents: r.unitPriceCents,
        quantity: r.quantity
      };
    });
  }
}
