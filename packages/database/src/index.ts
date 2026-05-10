export { db, createDatabase } from "@/client/db.client";

export type { Database } from "@/client/db.client";

export { usersTable } from "@/schemas/users/users.schema";

export type { UserRow, NewUserRow } from "@/schemas/users/users.schema";

export { organizationsTable } from "@/schemas/organizations/organizations.schema";

export type { OrganizationRow, NewOrganizationRow } from "@/schemas/organizations/organizations.schema";

export { restaurantsTable } from "@/schemas/restaurants/restaurants.schema";

export type { RestaurantRow, NewRestaurantRow } from "@/schemas/restaurants/restaurants.schema";

export { restaurantOpeningHoursTable } from "@/schemas/restaurant-opening-hours/restaurant-opening-hours.schema";

export type { RestaurantOpeningHoursRow, NewRestaurantOpeningHoursRow } from "@/schemas/restaurant-opening-hours/restaurant-opening-hours.schema";

export { restaurantTablesTable } from "@/schemas/restaurant-tables/restaurant-tables.schema";

export type { RestaurantTableRow, NewRestaurantTableRow } from "@/schemas/restaurant-tables/restaurant-tables.schema";

export { sessionsTable } from "@/schemas/sessions/sessions.schema";

export type { SessionRow, NewSessionRow } from "@/schemas/sessions/sessions.schema";

export { accountsTable } from "@/schemas/accounts/accounts.schema";

export type { AccountRow, NewAccountRow } from "@/schemas/accounts/accounts.schema";

export { verificationsTable } from "@/schemas/verifications/verifications.schema";

export type { VerificationRow, NewVerificationRow } from "@/schemas/verifications/verifications.schema";
