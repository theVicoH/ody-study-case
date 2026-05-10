export { db, createDatabase } from "@/client/db.client";

export type { Database } from "@/client/db.client";

export { usersTable } from "@/schemas/users/users.schema";

export type { UserRow, NewUserRow } from "@/schemas/users/users.schema";

export { organizationsTable } from "@/schemas/organizations/organizations.schema";

export type { OrganizationRow, NewOrganizationRow } from "@/schemas/organizations/organizations.schema";

export { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export type { RestaurantRow, NewRestaurantRow } from "@/schemas/restaurants/restaurants.schema";
