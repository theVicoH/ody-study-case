import "./env-config";

import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { notFound, onError } from "./middleware/error/error.middleware";
import { loggerMiddleware } from "./middleware/logger/logger.middleware";

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

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "API",
    version: "1.0.0",
    description: "API Documentation"
  }
});

app.get("/ui", swaggerUI({ url: "/doc" }));

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
