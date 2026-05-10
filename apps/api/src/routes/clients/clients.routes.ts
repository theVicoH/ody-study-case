/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ClientNotFoundError } from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";
import { errorSchema, paginationMetaSchema, paginationQuery } from "@/routes/_shared/pagination.schema";

const tags = ["Clients"];

const tagSchema = z.enum(["New", "Regular", "VIP"]);

const clientSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  notes: z.string().nullable(),
  tag: tagSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

const paginatedSchema = z.object({ data: z.array(clientSchema) }).merge(paginationMetaSchema);

const createBody = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

const updateBody = createBody.extend({
  tag: tagSchema.optional()
});

const restaurantIdParam = z.object({ restaurantId: z.string().uuid() });
const clientIdParams = z.object({ restaurantId: z.string().uuid(), id: z.string().uuid() });

const serialize = <T extends { createdAt: Date; updatedAt: Date }>(c: T): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString()
  });

export const clientsRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/clients",
      tags,
      request: { params: restaurantIdParam, query: paginationQuery },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: paginatedSchema } }, description: "List" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const { page, limit } = c.req.valid("query");
      const result = await container.client.list.execute({ restaurantId, page, limit });

      return c.json({ ...result, data: result.data.map(serialize) }, HttpStatus.OK);
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/{restaurantId}/clients",
      tags,
      request: {
        params: restaurantIdParam,
        body: { content: { "application/json": { schema: createBody } } }
      },
      responses: {
        [HttpStatus.CREATED]: { content: { "application/json": { schema: clientSchema } }, description: "Created" },
        [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const created = await container.client.create.execute({ restaurantId, ...body });

        return c.json(serialize(created), HttpStatus.CREATED);
      } catch (err) {
        return c.json({ error: (err as Error).message }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  )
  .openapi(
    createRoute({
      method: "patch",
      path: "/{restaurantId}/clients/{id}",
      tags,
      request: {
        params: clientIdParams,
        body: { content: { "application/json": { schema: updateBody } } }
      },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: clientSchema } }, description: "Updated" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const updated = await container.client.update.execute({ id, ...body });

        return c.json(serialize(updated), HttpStatus.OK);
      } catch (err) {
        if (err instanceof ClientNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{restaurantId}/clients/{id}",
      tags,
      request: { params: clientIdParams },
      responses: {
        [HttpStatus.NO_CONTENT]: { description: "Deleted" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        await container.client.delete.execute({ id });

        return c.body(null, HttpStatus.NO_CONTENT);
      } catch (err) {
        if (err instanceof ClientNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  );
