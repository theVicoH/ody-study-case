import { accountsTable, db, sessionsTable, usersTable, verificationsTable } from "@workspace/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SESSION_DAYS = 30;
const SESSION_TTL_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * SESSION_DAYS;
const SESSION_UPDATE_AGE_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

const TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  ...(process.env["ALLOWED_ORIGINS"] ?? "").split(",").map((o) => o.trim()).filter(Boolean)
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
  session: {
    expiresIn: SESSION_TTL_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
    cookieCache: {
      enabled: true,
      maxAge: SESSION_TTL_SECONDS
    }
  },
  advanced: {
    database: {
      generateId: (): string => crypto.randomUUID()
    }
  }
});

export type Auth = typeof auth;
