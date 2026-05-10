import { boolean, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export const restaurantOpeningHoursTable = pgTable(
  "restaurant_opening_hours",
  {
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurantsTable.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    isOpen: boolean("is_open").notNull().default(true),
    openTime: text("open_time").notNull().default("12:00"),
    closeTime: text("close_time").notNull().default("22:30"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [primaryKey({ columns: [table.restaurantId, table.dayOfWeek] })]
);

export type RestaurantOpeningHoursRow = typeof restaurantOpeningHoursTable.$inferSelect;

export type NewRestaurantOpeningHoursRow = typeof restaurantOpeningHoursTable.$inferInsert;
