/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db, restaurantTablesTable } from "@workspace/database";
import { HttpStatus } from "@workspace/shared";
import { and, count, eq, max } from "drizzle-orm";

import type { AppEnv } from "@/types/app-env.types";
import type { RestaurantTableRow } from "@workspace/database";

import { errorSchema } from "@/routes/_shared/pagination.schema";
import {
  bulkGenerateBodySchema,
  createTableBodySchema,
  listTablesQuerySchema,
  paginatedTablesSchema,
  restaurantIdParamSchema,
  restaurantTableSchema,
  tableIdParamsSchema,
  updateTableBodySchema
} from "@/routes/restaurant-tables/restaurant-tables.schemas";

const tags = ["Restaurant Tables"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

type TableZone = "salle" | "terrasse" | "bar" | "vip";
type TableStatus = "available" | "occupied" | "reserved";

const serialize = (row: RestaurantTableRow): {
  id: string;
  restaurantId: string;
  number: number;
  name: string | null;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} => ({
  id: row.id,
  restaurantId: row.restaurantId,
  number: row.number,
  name: row.name,
  capacity: row.capacity,
  zone: row.zone as TableZone,
  status: row.status as TableStatus,
  isActive: row.isActive,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
});

const listRoute = createRoute({
  method: "get",
  path: "/{restaurantId}/tables",
  tags,
  request: { params: restaurantIdParamSchema, query: listTablesQuerySchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: paginatedTablesSchema } }, description: "Paginated tables" }
  }
});

const createTableRoute = createRoute({
  method: "post",
  path: "/{restaurantId}/tables",
  tags,
  request: {
    params: restaurantIdParamSchema,
    body: { content: { "application/json": { schema: createTableBodySchema } } }
  },
  responses: {
    [HttpStatus.CREATED]: { content: { "application/json": { schema: restaurantTableSchema } }, description: "Created" },
    [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
  }
});

const updateTableRoute = createRoute({
  method: "patch",
  path: "/{restaurantId}/tables/{id}",
  tags,
  request: {
    params: tableIdParamsSchema,
    body: { content: { "application/json": { schema: updateTableBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: restaurantTableSchema } }, description: "Updated" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const deleteTableRoute = createRoute({
  method: "delete",
  path: "/{restaurantId}/tables/{id}",
  tags,
  request: { params: tableIdParamsSchema },
  responses: {
    [HttpStatus.NO_CONTENT]: { description: "Deleted" },
    [HttpStatus.NOT_FOUND]: { content: { "application/json": { schema: errorSchema } }, description: "Not found" }
  }
});

const bulkGenerateRoute = createRoute({
  method: "post",
  path: "/{restaurantId}/tables/bulk-generate",
  tags,
  request: {
    params: restaurantIdParamSchema,
    body: { content: { "application/json": { schema: bulkGenerateBodySchema } } }
  },
  responses: {
    [HttpStatus.CREATED]: { content: { "application/json": { schema: paginatedTablesSchema } }, description: "Generated tables" }
  }
});

export const restaurantTablesRouter = new OpenAPIHono<AppEnv>()
  .openapi(listRoute, async (c) => {
    const { restaurantId } = c.req.valid("param");
    const q = c.req.valid("query");
    const page = q.page ? parseInt(q.page, 10) : DEFAULT_PAGE;
    const limit = q.limit ? parseInt(q.limit, 10) : DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const filters = [eq(restaurantTablesTable.restaurantId, restaurantId)];

    if (q.zone) filters.push(eq(restaurantTablesTable.zone, q.zone));
    if (q.status) filters.push(eq(restaurantTablesTable.status, q.status));
    const where = filters.length === 1 ? filters[0] : and(...filters);

    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      db.select().from(restaurantTablesTable).where(where).orderBy(restaurantTablesTable.number).limit(limit).offset(offset),
      db.select({ value: count() }).from(restaurantTablesTable).where(where)
    ]);
    const totalNum = Number(total);

    return c.json({
      data: rows.map(serialize),
      total: totalNum,
      page,
      limit,
      totalPages: Math.ceil(totalNum / limit)
    }, HttpStatus.OK);
  })
  .openapi(createTableRoute, async (c) => {
    const { restaurantId } = c.req.valid("param");
    const body = c.req.valid("json");
    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(restaurantTablesTable).values({
      id,
      restaurantId,
      number: body.number,
      name: body.name ?? null,
      capacity: body.capacity,
      zone: body.zone,
      status: body.status,
      isActive: body.isActive,
      createdAt: now,
      updatedAt: now
    });

    const [row] = await db.select().from(restaurantTablesTable).where(eq(restaurantTablesTable.id, id)).limit(1);

    return c.json(serialize(row!), HttpStatus.CREATED);
  })
  .openapi(updateTableRoute, async (c) => {
    const { restaurantId, id } = c.req.valid("param");
    const body = c.req.valid("json");
    const now = new Date();

    await db
      .update(restaurantTablesTable)
      .set({ ...body, updatedAt: now })
      .where(and(eq(restaurantTablesTable.id, id), eq(restaurantTablesTable.restaurantId, restaurantId)));

    const [row] = await db.select().from(restaurantTablesTable).where(eq(restaurantTablesTable.id, id)).limit(1);

    if (!row) return c.json({ error: "Table not found" }, HttpStatus.NOT_FOUND);

    return c.json(serialize(row), HttpStatus.OK);
  })
  .openapi(deleteTableRoute, async (c) => {
    const { restaurantId, id } = c.req.valid("param");

    await db
      .delete(restaurantTablesTable)
      .where(and(eq(restaurantTablesTable.id, id), eq(restaurantTablesTable.restaurantId, restaurantId)));

    return c.body(null, HttpStatus.NO_CONTENT);
  })
  .openapi(bulkGenerateRoute, async (c) => {
    const { restaurantId } = c.req.valid("param");
    const body = c.req.valid("json");
    const now = new Date();

    const [{ value: currentMax } = { value: 0 }] = await db
      .select({ value: max(restaurantTablesTable.number) })
      .from(restaurantTablesTable)
      .where(eq(restaurantTablesTable.restaurantId, restaurantId));
    const start = Math.max(body.startNumber, Number(currentMax ?? 0) + 1);

    const values = Array.from({ length: body.count }, (_, i) => ({
      id: crypto.randomUUID(),
      restaurantId,
      number: start + i,
      name: null,
      capacity: body.capacity,
      zone: body.zone,
      status: "available" as const,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }));

    if (values.length > 0) {
      await db.insert(restaurantTablesTable).values(values);
    }

    const rows = await db
      .select()
      .from(restaurantTablesTable)
      .where(eq(restaurantTablesTable.restaurantId, restaurantId))
      .orderBy(restaurantTablesTable.number);

    return c.json({
      data: rows.map(serialize),
      total: rows.length,
      page: 1,
      limit: rows.length || 1,
      totalPages: 1
    }, HttpStatus.CREATED);
  });
