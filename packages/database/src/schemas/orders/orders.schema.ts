import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clientsTable } from "@/schemas/clients/clients.schema";
import { restaurantTablesTable } from "@/schemas/restaurant-tables/restaurant-tables.schema";
import { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  READY: "ready",
  SERVED: "served",
  PAID: "paid",
  CANCELLED: "cancelled"
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ordersTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurantsTable.id, { onDelete: "cascade" }),
    clientId: uuid("client_id").references(() => clientsTable.id, { onDelete: "set null" }),
    tableId: uuid("table_id").references(() => restaurantTablesTable.id, { onDelete: "set null" }),
    status: text("status").notNull().default(ORDER_STATUS.PENDING),
    totalCents: integer("total_cents").notNull().default(0),
    notes: text("notes"),
    placedAt: timestamp("placed_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [
    index("orders_restaurant_idx").on(table.restaurantId),
    index("orders_client_idx").on(table.clientId),
    index("orders_status_idx").on(table.status)
  ]
);

export type OrderRow = typeof ordersTable.$inferSelect;

export type NewOrderRow = typeof ordersTable.$inferInsert;
