import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export const clientsTable = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurantsTable.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    notes: text("notes"),
    tag: text("tag").notNull().default("New"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("clients_restaurant_email_unique").on(table.restaurantId, table.email),
    index("clients_restaurant_idx").on(table.restaurantId)
  ]
);

export type ClientRow = typeof clientsTable.$inferSelect;

export type NewClientRow = typeof clientsTable.$inferInsert;
