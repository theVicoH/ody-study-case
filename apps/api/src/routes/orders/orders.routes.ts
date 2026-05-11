/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ORDER_STATUS, OrderNotFoundError } from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";
import type { OrderResponseDTO } from "@workspace/application";
import type { OrderStatus } from "@workspace/domain";

import { container } from "@/infrastructure/container/container";
import { errorSchema, paginationMetaSchema, paginationQuery } from "@/routes/_shared/pagination.schema";

const tags = ["Orders"];

const ALL_STATUSES = Object.values(ORDER_STATUS) as [string, ...string[]];

const orderItemSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(["menu", "dish"]),
  refId: z.string().uuid(),
  nameSnapshot: z.string(),
  unitPriceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  lineTotalCents: z.number().int().nonnegative()
});

const orderSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  clientId: z.string().uuid().nullable(),
  tableId: z.string().uuid().nullable(),
  status: z.enum(ALL_STATUSES),
  notes: z.string().nullable(),
  placedAt: z.string(),
  totalCents: z.number().int().nonnegative(),
  items: z.array(orderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});

const paginatedSchema = z.object({ data: z.array(orderSchema) }).merge(paginationMetaSchema);

const createBody = z.object({
  clientId: z.string().uuid().nullable().optional(),
  tableId: z.string().uuid().nullable().optional(),
  status: z.enum(ALL_STATUSES).optional(),
  notes: z.string().nullable().optional(),
  placedAt: z.string().datetime().optional(),
  items: z
    .array(z.object({
      kind: z.enum(["menu", "dish"]),
      refId: z.string().uuid(),
      quantity: z.number().int().positive()
    }))
    .min(1)
});

const updateStatusBody = z.object({ status: z.enum(ALL_STATUSES) });

const restaurantIdParam = z.object({ restaurantId: z.string().uuid() });
const orderIdParams = z.object({ restaurantId: z.string().uuid(), id: z.string().uuid() });

const listQuery = paginationQuery.extend({ clientId: z.string().uuid().optional() });

const serialize = (o: OrderResponseDTO): Omit<OrderResponseDTO, "placedAt" | "createdAt" | "updatedAt"> & { placedAt: string; createdAt: string; updatedAt: string } => ({
  ...o,
  placedAt: o.placedAt.toISOString(),
  createdAt: o.createdAt.toISOString(),
  updatedAt: o.updatedAt.toISOString()
});

export const ordersRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/orders",
      tags,
      request: { params: restaurantIdParam, query: listQuery },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: paginatedSchema } }, description: "List" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const { page, limit, clientId } = c.req.valid("query");
      const result = await container.order.list.execute({ restaurantId, page, limit, clientId });

      return c.json({ ...result, data: result.data.map(serialize) }, HttpStatus.OK);
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/orders/{id}",
      tags,
      request: { params: orderIdParams },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: orderSchema } }, description: "Get" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        const order = await container.order.get.execute({ id });

        return c.json(serialize(order), HttpStatus.OK);
      } catch (err) {
        if (err instanceof OrderNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/{restaurantId}/orders",
      tags,
      request: { params: restaurantIdParam, body: { content: { "application/json": { schema: createBody } } } },
      responses: {
        [HttpStatus.CREATED]: { content: { "application/json": { schema: orderSchema } }, description: "Created" },
        [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const created = await container.order.create.execute({
          restaurantId,
          clientId: body.clientId,
          tableId: body.tableId,
          status: body.status as OrderStatus | undefined,
          notes: body.notes,
          placedAt: body.placedAt ? new Date(body.placedAt) : undefined,
          items: body.items
        });

        return c.json(serialize(created), HttpStatus.CREATED);
      } catch (err) {
        return c.json({ error: (err as Error).message }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  )
  .openapi(
    createRoute({
      method: "patch",
      path: "/{restaurantId}/orders/{id}/status",
      tags,
      request: { params: orderIdParams, body: { content: { "application/json": { schema: updateStatusBody } } } },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: orderSchema } }, description: "Updated" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      try {
        const updated = await container.order.updateStatus.execute({ id, status: body.status as OrderStatus });

        return c.json(serialize(updated), HttpStatus.OK);
      } catch (err) {
        if (err instanceof OrderNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{restaurantId}/orders/{id}",
      tags,
      request: { params: orderIdParams },
      responses: {
        [HttpStatus.NO_CONTENT]: { description: "Deleted" },
        [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
      }
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        await container.order.delete.execute({ id });

        return c.body(null, HttpStatus.NO_CONTENT);
      } catch (err) {
        if (err instanceof OrderNotFoundError) {
          return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
        }
        throw err;
      }
    }
  );
