import { Hono } from "hono";

import { loggerMiddleware } from "./logger.middleware";

import type { PinoLogger } from "hono-pino";


describe("loggerMiddleware", () => {
  it("should inject a pino logger into context", async () => {
    const app = new Hono<{ Variables: { logger: PinoLogger }}>();

    app.use("/*", loggerMiddleware);

    app.get("/test", (c) => {
      const { logger } = c.var;

      return c.json({ hasLogger: logger !== undefined });
    });

    const res = await app.request("/test");

    const body = (await res.json()) as { hasLogger: boolean };

    expect(res.status).toBe(200);
    expect(body.hasLogger).toBe(true);
  });

  it("should return 200 on a standard request", async () => {
    const app = new Hono();

    app.use("/*", loggerMiddleware);
    app.get("/health", (c) => c.text("OK"));

    const res = await app.request("/health");

    expect(res.status).toBe(200);
  });
});
