/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema } from "@/routes/_shared/pagination.schema";
import {
  createOrganizationBodySchema,
  listOrganizationsQuerySchema,
  organizationParamsSchema,
  organizationResponseSchema,
  paginatedOrganizationsSchema,
  updateOrganizationBodySchema
} from "@/routes/organizations/organizations.schemas";


const tags = ["Organizations"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  request: { query: listOrganizationsQuerySchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: paginatedOrganizationsSchema } }, description: "Paginated organizations" }
  }
});

const getRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  request: { params: organizationParamsSchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: organizationResponseSchema } }, description: "Organization" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const createRouteDef = createRoute({
  method: "post",
  path: "/",
  tags,
  request: { body: { content: { "application/json": { schema: createOrganizationBodySchema } } } },
  responses: {
    [HttpStatus.CREATED]: { content: { "application/json": { schema: organizationResponseSchema } }, description: "Created" },
    [HttpStatus.CONFLICT]: { content: { "application/json": { schema: errorSchema } }, description: "Conflict" }
  }
});

const updateRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags,
  request: {
    params: organizationParamsSchema,
    body: { content: { "application/json": { schema: updateOrganizationBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: organizationResponseSchema } }, description: "Updated" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const deleteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  request: { params: organizationParamsSchema },
  responses: {
    [HttpStatus.NO_CONTENT]: { description: "Deleted" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

export const organizationsRouter = new OpenAPIHono<AppEnv>()
  .openapi(listRoute, async (c) => {
    const q = c.req.valid("query");
    const page = q.page ? parseInt(q.page, 10) : DEFAULT_PAGE;
    const limit = q.limit ? parseInt(q.limit, 10) : DEFAULT_LIMIT;
    const result = await container.organization.list.execute({ page, limit, ownerId: q.ownerId });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(getRoute, async (c) => {
    const { id } = c.req.valid("param");
    const result = await container.organization.get.execute({ id });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(createRouteDef, async (c) => {
    const body = c.req.valid("json");
    const result = await container.organization.create.execute(body);

    return c.json(result, HttpStatus.CREATED);
  })
  .openapi(updateRoute, async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await container.organization.update.execute({ id, ...body });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(deleteRoute, async (c) => {
    const { id } = c.req.valid("param");

    await container.organization.delete.execute({ id });

    return c.body(null, HttpStatus.NO_CONTENT);
  });
