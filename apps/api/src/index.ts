import "./env-config";

import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";

import { auth } from "./lib/auth/auth";
import { notFound, onError } from "./middleware/error/error.middleware";
import { loggerMiddleware } from "./middleware/logger/logger.middleware";
import { authRouter } from "./routes/auth/auth.routes";
import { organizationsRouter } from "./routes/organizations/organizations.routes";
import { restaurantOpeningHoursRouter } from "./routes/restaurant-opening-hours/restaurant-opening-hours.routes";
import { restaurantTablesRouter } from "./routes/restaurant-tables/restaurant-tables.routes";
import { restaurantsRouter } from "./routes/restaurants/restaurants.routes";
import { usersRouter } from "./routes/users/users.routes";

import type { AppEnv } from "./types/app-env.types";

const app = new OpenAPIHono<AppEnv>();

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env["VITE_API_URL"] ?? ""
].filter(Boolean);

app.use("/*", cors({
  origin: (origin) => {
    if (!origin) return ALLOWED_ORIGINS[0] ?? "";

    return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use("/*", loggerMiddleware);

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/auth", authRouter);
app.route("/users", usersRouter);
app.route("/organizations", organizationsRouter);
app.route("/restaurants", restaurantsRouter);
app.route("/restaurants", restaurantOpeningHoursRouter);
app.route("/restaurants", restaurantTablesRouter);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Ody API",
    version: "1.0.0",
    description: "Restaurant management API"
  }
});

app.get("/docs", Scalar({ url: "/openapi.json", theme: "purple", pageTitle: "Ody API" }));

app.get("/health", (c) => c.text("OK"));

app.notFound(notFound);
app.onError(onError);

export type AppType = typeof app;

export default {
  port: 3001,
  fetch(req: Request, server: Bun.Server<undefined>): Response | Promise<Response> {
    const ip = server.requestIP(req)?.address;

    if (ip && !req.headers.get("x-forwarded-for")) {
      const headers = new Headers(req.headers);

      headers.set("x-forwarded-for", ip);

      return app.fetch(new Request(req, { headers }), server);
    }

    return app.fetch(req, server);
  }
};
