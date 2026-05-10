import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { organizationsTable } from "@/schemas/organizations/organizations.schema";

export const restaurantsTable = pgTable("restaurants", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  maxCovers: integer("max_covers").notNull(),
  tableService: boolean("table_service").notNull().default(true),
  clickAndCollect: boolean("click_and_collect").notNull().default(false),
  kitchenNotifications: boolean("kitchen_notifications").notNull().default(true),
  testMode: boolean("test_mode").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
});

export type RestaurantRow = typeof restaurantsTable.$inferSelect;

export type NewRestaurantRow = typeof restaurantsTable.$inferInsert;
