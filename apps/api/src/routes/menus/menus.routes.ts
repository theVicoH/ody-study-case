/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { MenuNotFoundError } from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema, paginationMetaSchema, paginationQuery } from "@/routes/_shared/pagination.schema";

const tags = ["Menus"];

const menuSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  priceCents: z.number().int().nonnegative(),
  isActive: z.boolean(),
  dishIds: z.array(z.string().uuid()),
  createdAt: z.string(),
  updatedAt: z.string()
});

const paginatedSchema = z.object({ data: z.array(menuSchema) }).merge(paginationMetaSchema);

const createBody = z.object({
  name: z.string().min(2).max(120),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
  dishIds: z.array(z.string().uuid())
});

const updateBody = z.object({
  name: z.string().min(2).max(120),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  isActive: z.boolean(),
  dishIds: z.array(z.string().uuid())
});

const restaurantIdParam = z.object({ restaurantId: z.string().uuid() });
const menuIdParams = z.object({ restaurantId: z.string().uuid(), id: z.string().uuid() });

const serialize = <T extends { createdAt: Date; updatedAt: Date }>(m: T): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} => ({
  ...m,
  createdAt: m.createdAt.toISOString(),
  updatedAt: m.updatedAt.toISOString()
});

export const menusRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/menus",
      tags,
      request: { params: restaurantIdParam, query: paginationQuery },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: paginatedSchema } }, description: "List" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const { page, limit } = c.req.valid("query");
      const result = await container.menu.list.execute({ restaurantId, page, limit });

      return c.json({ ...result, data: result.data.map(serialize) }, HttpStatus.OK);
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/{restaurantId}/menus",
      tags,
      request: { params: restaurantIdParam, body: { content: { "application/json": { schema: createBody } } } },
      responses: {
        [HttpStatus.CREATED]: { content: { "application/json": { schema: menuSchema } }, description: "Created" },
        [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const created = await container.menu.create.execute({ restaurantId, ...body });

        return c.json(serialize(created), HttpStatus.CREATED);
      } catch (err) {
        return c.json({ error: (err as Error).message }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  )
  .openapi(
    createRoute({
      method: "patch",
      path: "/{restaurantId}/menus/{id}",
      tags,
      request: { params: menuIdParams, body: { content: { "application/json": { schema: updateBody } } } },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: menuSchema } }, description: "Updated" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const updated = await container.menu.update.execute({ id, ...body });

        return c.json(serialize(updated), HttpStatus.OK);
      } catch (err) {
        if (err instanceof MenuNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{restaurantId}/menus/{id}",
      tags,
      request: { params: menuIdParams },
      responses: {
        [HttpStatus.NO_CONTENT]: { description: "Deleted" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        await container.menu.delete.execute({ id });

        return c.body(null, HttpStatus.NO_CONTENT);
      } catch (err) {
        if (err instanceof MenuNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  );
