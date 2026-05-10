import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { dishesTable } from "@/schemas/dishes/dishes.schema";
import { menusTable } from "@/schemas/menus/menus.schema";
import { ordersTable } from "@/schemas/orders/orders.schema";

export const orderItemsTable = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    menuId: uuid("menu_id").references(() => menusTable.id, { onDelete: "set null" }),
    dishId: uuid("dish_id").references(() => dishesTable.id, { onDelete: "set null" }),
    nameSnapshot: text("name_snapshot").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull().default(1)
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    check(
      "order_items_menu_xor_dish",
      sql`(${table.menuId} IS NOT NULL)::int + (${table.dishId} IS NOT NULL)::int = 1`
    ),
    check("order_items_quantity_positive", sql`${table.quantity} > 0`)
  ]
);

export type OrderItemRow = typeof orderItemsTable.$inferSelect;

export type NewOrderItemRow = typeof orderItemsTable.$inferInsert;
