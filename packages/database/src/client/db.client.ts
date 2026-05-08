import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export type Database = ReturnType<typeof drizzle>;

export function createDatabase(url: string): Database {
  return drizzle(postgres(url));
}

export const db = createDatabase(process.env["DATABASE_URL"]!);
