import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const verificationsTable = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
});

export type VerificationRow = typeof verificationsTable.$inferSelect;

export type NewVerificationRow = typeof verificationsTable.$inferInsert;
