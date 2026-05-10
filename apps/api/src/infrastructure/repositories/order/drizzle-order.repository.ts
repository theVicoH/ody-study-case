import { orderItemsTable, ordersTable } from "@workspace/database";
import {
  ClientId,
  DishId,
  MenuId,
  Money,
  Order,
  OrderId,
  OrderItem,
  OrderItemId,
  RestaurantId
} from "@workspace/domain";
import { count, desc, eq, inArray } from "drizzle-orm";

import type { Database, OrderItemRow, OrderRow } from "@workspace/database";
import type {
  IOrderRepository,
  OrderItemRef,
  OrderStatus,
  PaginatedResult,
  PaginationParams
} from "@workspace/domain";

export class DrizzleOrderRepository implements IOrderRepository {
  constructor(private readonly db: Database) {}

  async findById(id: OrderId): Promise<Order | null> {
    const [row] = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id.toString()))
      .limit(1);

    if (!row) return null;

    const items = await this.db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, row.id));

    return this.toEntity(row, items);
  }

  async findByRestaurant(
    restaurantId: RestaurantId,
    params: PaginationParams
  ): Promise<PaginatedResult<Order>> {
    const where = eq(ordersTable.restaurantId, restaurantId.toString());

    return this.paginated(where, params);
  }

  async findByClient(clientId: ClientId, params: PaginationParams): Promise<PaginatedResult<Order>> {
    const where = eq(ordersTable.clientId, clientId.toString());

    return this.paginated(where, params);
  }

  async save(order: Order): Promise<void> {
    const id = order.id.toString();
    const orderValues = {
      id,
      restaurantId: order.restaurantId.toString(),
      clientId: order.props.clientId?.toString() ?? null,
      tableId: order.props.tableId,
      status: order.props.status,
      totalCents: order.total().toCents(),
      notes: order.props.notes,
      placedAt: order.props.placedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    await this.db.transaction(async (tx) => {
      await tx
        .insert(ordersTable)
        .values(orderValues)
        .onConflictDoUpdate({
          target: ordersTable.id,
          set: {
            clientId: orderValues.clientId,
            tableId: orderValues.tableId,
            status: orderValues.status,
            totalCents: orderValues.totalCents,
            notes: orderValues.notes,
            placedAt: orderValues.placedAt,
            updatedAt: orderValues.updatedAt
          }
        });

      await tx.delete(orderItemsTable).where(eq(orderItemsTable.orderId, id));

      if (order.props.items.length > 0) {
        await tx.insert(orderItemsTable).values(order.props.items.map((item) => ({
          id: item.id.toString(),
          orderId: id,
          menuId: item.props.ref.kind === "menu" ? item.props.ref.menuId.toString() : null,
          dishId: item.props.ref.kind === "dish" ? item.props.ref.dishId.toString() : null,
          nameSnapshot: item.props.nameSnapshot,
          unitPriceCents: item.props.unitPrice.toCents(),
          quantity: item.props.quantity
        })));
      }
    });
  }

  async delete(id: OrderId): Promise<void> {
    await this.db.delete(ordersTable).where(eq(ordersTable.id, id.toString()));
  }

  private async paginated(
    where: ReturnType<typeof eq>,
    params: PaginationParams
  ): Promise<PaginatedResult<Order>> {
    const offset = (params.page - 1) * params.limit;
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db
        .select()
        .from(ordersTable)
        .where(where)
        .orderBy(desc(ordersTable.placedAt))
        .limit(params.limit)
        .offset(offset),
      this.db.select({ value: count() }).from(ordersTable).where(where)
    ]);

    const ids = rows.map((r) => r.id);
    const items = ids.length
      ? await this.db.select().from(orderItemsTable).where(inArray(orderItemsTable.orderId, ids))
      : [];
    const itemsByOrder = new Map<string, OrderItemRow[]>();

    for (const item of items) {
      const arr = itemsByOrder.get(item.orderId) ?? [];

      arr.push(item);
      itemsByOrder.set(item.orderId, arr);
    }

    const totalNum = Number(total);

    return {
      data: rows.map((r) => this.toEntity(r, itemsByOrder.get(r.id) ?? [])),
      total: totalNum,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(totalNum / params.limit)
    };
  }

  private toEntity(row: OrderRow, items: OrderItemRow[]): Order {
    return Order.reconstitute(
      OrderId.create(row.id),
      RestaurantId.create(row.restaurantId),
      {
        clientId: row.clientId ? ClientId.create(row.clientId) : null,
        tableId: row.tableId,
        status: row.status as OrderStatus,
        notes: row.notes,
        placedAt: row.placedAt,
        items: items.map((it) => this.toItem(it))
      },
      row.createdAt,
      row.updatedAt
    );
  }

  private toItem(row: OrderItemRow): OrderItem {
    const ref: OrderItemRef = row.menuId
      ? { kind: "menu", menuId: MenuId.create(row.menuId) }
      : { kind: "dish", dishId: DishId.create(row.dishId!) };

    return OrderItem.reconstitute(OrderItemId.create(row.id), {
      ref,
      nameSnapshot: row.nameSnapshot,
      unitPrice: Money.fromCents(row.unitPriceCents),
      quantity: row.quantity
    });
  }
}
