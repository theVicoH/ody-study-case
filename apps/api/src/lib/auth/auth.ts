import { accountsTable, db, sessionsTable, usersTable, verificationsTable } from "@workspace/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env["VITE_API_URL"] ?? ""
].filter(Boolean);

export const auth = betterAuth({
  secret: process.env["BETTER_AUTH_SECRET"] ?? "dev-secret-change-me",
  baseURL: process.env["BETTER_AUTH_URL"] ?? "http://localhost:3001",
  trustedOrigins: TRUSTED_ORIGINS,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable
    }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    minPasswordLength: 8
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
      birthday: { type: "date", required: true, input: true }
    }
  },
  advanced: {
    database: {
      generateId: (): string => crypto.randomUUID()
    }
  }
});

export type Auth = typeof auth;
