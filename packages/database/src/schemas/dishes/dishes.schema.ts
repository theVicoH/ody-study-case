import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export const dishesTable = pgTable(
  "dishes",
  {
    id: uuid("id").primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurantsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    category: text("category").notNull().default("main"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [index("dishes_restaurant_idx").on(table.restaurantId)]
);

export type DishRow = typeof dishesTable.$inferSelect;

export type NewDishRow = typeof dishesTable.$inferInsert;
