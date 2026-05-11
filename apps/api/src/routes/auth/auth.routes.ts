/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { userResponseSchema } from "@/routes/users/users.schemas";


const tags = ["Auth"];

const demoRoute = createRoute({
  method: "get",
  path: "/demo",
  tags,
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: userResponseSchema } }, description: "Demo user" }
  }
});

export const authRouter = new OpenAPIHono<AppEnv>().openapi(demoRoute, async (c) => {
  const result = await container.user.getOrCreateDemo.execute();

  return c.json(result, HttpStatus.OK);
});
