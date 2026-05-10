/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { DishNotFoundError } from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema, paginationMetaSchema, paginationQuery } from "@/routes/_shared/pagination.schema";

const tags = ["Dishes"];

const dishSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  priceCents: z.number().int().nonnegative(),
  category: z.string(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const paginatedSchema = z.object({ data: z.array(dishSchema) }).merge(paginationMetaSchema);

const createBody = z.object({
  name: z.string().min(2).max(120),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  category: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional()
});

const updateBody = z.object({
  name: z.string().min(2).max(120),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  category: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean()
});

const restaurantIdParam = z.object({ restaurantId: z.string().uuid() });
const dishIdParams = z.object({ restaurantId: z.string().uuid(), id: z.string().uuid() });

const serialize = <T extends { createdAt: Date; updatedAt: Date }>(d: T): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} => ({
  ...d,
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt.toISOString()
});

export const dishesRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/dishes",
      tags,
      request: { params: restaurantIdParam, query: paginationQuery },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: paginatedSchema } }, description: "List" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const { page, limit } = c.req.valid("query");
      const result = await container.dish.list.execute({ restaurantId, page, limit });

      return c.json({ ...result, data: result.data.map(serialize) }, HttpStatus.OK);
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/{restaurantId}/dishes",
      tags,
      request: { params: restaurantIdParam, body: { content: { "application/json": { schema: createBody } } } },
      responses: {
        [HttpStatus.CREATED]: { content: { "application/json": { schema: dishSchema } }, description: "Created" },
        [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const created = await container.dish.create.execute({ restaurantId, ...body });

        return c.json(serialize(created), HttpStatus.CREATED);
      } catch (err) {
        return c.json({ error: (err as Error).message }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  )
  .openapi(
    createRoute({
      method: "patch",
      path: "/{restaurantId}/dishes/{id}",
      tags,
      request: { params: dishIdParams, body: { content: { "application/json": { schema: updateBody } } } },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: dishSchema } }, description: "Updated" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const updated = await container.dish.update.execute({ id, ...body });

        return c.json(serialize(updated), HttpStatus.OK);
      } catch (err) {
        if (err instanceof DishNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{restaurantId}/dishes/{id}",
      tags,
      request: { params: dishIdParams },
      responses: {
        [HttpStatus.NO_CONTENT]: { description: "Deleted" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        await container.dish.delete.execute({ id });

        return c.body(null, HttpStatus.NO_CONTENT);
      } catch (err) {
        if (err instanceof DishNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  );
