import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export const restaurantTablesTable = pgTable(
  "restaurant_tables",
  {
    id: uuid("id").primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurantsTable.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    name: text("name"),
    capacity: integer("capacity").notNull().default(2),
    zone: text("zone").notNull().default("salle"),
    status: text("status").notNull().default("available"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [uniqueIndex("restaurant_tables_restaurant_number_unique").on(table.restaurantId, table.number)]
);

export type RestaurantTableRow = typeof restaurantTablesTable.$inferSelect;

export type NewRestaurantTableRow = typeof restaurantTablesTable.$inferInsert;
