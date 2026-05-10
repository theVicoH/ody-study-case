import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "@/schemas/users/users.schema";

export const organizationsTable = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
  },
  (table) => [uniqueIndex("organizations_name_unique").on(table.name)]
);

export type OrganizationRow = typeof organizationsTable.$inferSelect;

export type NewOrganizationRow = typeof organizationsTable.$inferInsert;
