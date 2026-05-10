import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { dishesTable } from "@/schemas/dishes/dishes.schema";
import { menusTable } from "@/schemas/menus/menus.schema";

export const menuDishesTable = pgTable(
  "menu_dishes",
  {
    menuId: uuid("menu_id")
      .notNull()
      .references(() => menusTable.id, { onDelete: "cascade" }),
    dishId: uuid("dish_id")
      .notNull()
      .references(() => dishesTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0)
  },
  (table) => [primaryKey({ columns: [table.menuId, table.dishId] })]
);

export type MenuDishRow = typeof menuDishesTable.$inferSelect;

export type NewMenuDishRow = typeof menuDishesTable.$inferInsert;
