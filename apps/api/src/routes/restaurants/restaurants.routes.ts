/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema } from "@/routes/_shared/pagination.schema";
import {
  createRestaurantBodySchema,
  listRestaurantsQuerySchema,
  paginatedRestaurantsSchema,
  restaurantParamsSchema,
  restaurantResponseSchema,
  updateRestaurantBodySchema,
  updateRestaurantSettingsBodySchema
} from "@/routes/restaurants/restaurants.schemas";


const tags = ["Restaurants"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  request: { query: listRestaurantsQuerySchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: paginatedRestaurantsSchema } }, description: "Paginated restaurants" }
  }
});

const getRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  request: { params: restaurantParamsSchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: restaurantResponseSchema } }, description: "Restaurant" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const createRouteDef = createRoute({
  method: "post",
  path: "/",
  tags,
  request: { body: { content: { "application/json": { schema: createRestaurantBodySchema } } } },
  responses: {
    [HttpStatus.CREATED]: { content: { "application/json": { schema: restaurantResponseSchema } }, description: "Created" },
    [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
  }
});

const updateRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags,
  request: {
    params: restaurantParamsSchema,
    body: { content: { "application/json": { schema: updateRestaurantBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: restaurantResponseSchema } }, description: "Updated" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const updateSettingsRoute = createRoute({
  method: "patch",
  path: "/{id}/settings",
  tags,
  request: {
    params: restaurantParamsSchema,
    body: { content: { "application/json": { schema: updateRestaurantSettingsBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: restaurantResponseSchema } }, description: "Settings updated" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const deleteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  request: { params: restaurantParamsSchema },
  responses: {
    [HttpStatus.NO_CONTENT]: { description: "Deleted" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

export const restaurantsRouter = new OpenAPIHono<AppEnv>()
  .openapi(listRoute, async (c) => {
    const q = c.req.valid("query");
    const page = q.page ? parseInt(q.page, 10) : DEFAULT_PAGE;
    const limit = q.limit ? parseInt(q.limit, 10) : DEFAULT_LIMIT;
    const result = await container.restaurant.list.execute({ page, limit, organizationId: q.organizationId });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(getRoute, async (c) => {
    const { id } = c.req.valid("param");
    const result = await container.restaurant.get.execute({ id });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(createRouteDef, async (c) => {
    const body = c.req.valid("json");
    const result = await container.restaurant.create.execute(body);

    return c.json(result, HttpStatus.CREATED);
  })
  .openapi(updateRoute, async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await container.restaurant.update.execute({ id, ...body });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(updateSettingsRoute, async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await container.restaurant.updateSettings.execute({ id, ...body });

    return c.json(result, HttpStatus.OK);
  })
  .openapi(deleteRoute, async (c) => {
    const { id } = c.req.valid("param");

    await container.restaurant.delete.execute({ id });

    return c.body(null, HttpStatus.NO_CONTENT);
  });
