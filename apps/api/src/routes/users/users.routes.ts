/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema, paginationQuery } from "@/routes/_shared/pagination.schema";
import {
  createUserBodySchema,
  paginatedUsersSchema,
  updateUserBodySchema,
  userParamsSchema,
  userResponseSchema
} from "@/routes/users/users.schemas";


const tags = ["Users"];

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  request: { query: paginationQuery },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: paginatedUsersSchema } }, description: "Paginated users" }
  }
});

const getRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  request: { params: userParamsSchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: userResponseSchema } }, description: "User" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const createRouteDef = createRoute({
  method: "post",
  path: "/",
  tags,
  request: { body: { content: { "application/json": { schema: createUserBodySchema } } } },
  responses: {
    [HttpStatus.CREATED]: { content: { "application/json": { schema: userResponseSchema } }, description: "Created" },
    [HttpStatus.CONFLICT]: { content: { "application/json": { schema: errorSchema } }, description: "Conflict" }
  }
});

const updateRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags,
  request: {
    params: userParamsSchema,
    body: { content: { "application/json": { schema: updateUserBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: userResponseSchema } }, description: "Updated" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

export const usersRouter = new OpenAPIHono<AppEnv>()
  .openapi(listRoute, async (c) => {
    const { page, limit } = c.req.valid("query");
    const result = await container.user.list.execute({ page, limit });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(getRoute, async (c) => {
    const { id } = c.req.valid("param");
    const result = await container.user.get.execute({ id });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(createRouteDef, async (c) => {
    const body = c.req.valid("json");
    const result = await container.user.create.execute({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      birthday: new Date(body.birthday)
    });

    return c.json(result, HttpStatus.CREATED);
  })
  .openapi(updateRoute, async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await container.user.update.execute({ id, ...body });

    return c.json(result, HttpStatus.OK);
  });
