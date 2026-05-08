import {
  UserNotFoundError,
  UserAlreadyExistsError
} from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";
import { Hono } from "hono";
import { describe, test, expect } from "vitest";


const buildTestApp = (): Hono => {
  const app = new Hono();

  app.get("/throw/user-not-found", () => {
    throw new UserNotFoundError("user-123");
  });

  app.get("/throw/user-already-exists", () => {
    throw new UserAlreadyExistsError("test@example.com");
  });

  app.get("/throw/unknown", () => {
    throw new Error("Something unexpected");
  });

  app.onError((err, c) => {
    if (err instanceof UserNotFoundError) {
      return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
    }

    if (err instanceof UserAlreadyExistsError) {
      return c.json({ error: err.message }, HttpStatus.CONFLICT);
    }

    return c.json({ error: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
  });

  return app;
};

describe("onError handler", () => {
  const app = buildTestApp();

  test("UserNotFoundError → 404 with error message", async () => {
    const error = new UserNotFoundError("user-123");
    const res = await app.request("/throw/user-not-found");

    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(await res.json()).toEqual({ error: error.message });
  });

  test("UserAlreadyExistsError → 409 with error message", async () => {
    const error = new UserAlreadyExistsError("test@example.com");
    const res = await app.request("/throw/user-already-exists");

    expect(res.status).toBe(HttpStatus.CONFLICT);
    expect(await res.json()).toEqual({ error: error.message });
  });

  test("unknown error → 500 with { error: 'Internal server error' }", async () => {
    const res = await app.request("/throw/unknown");

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal server error" });
  });
});
