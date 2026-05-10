/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "@/routes/_shared/pagination.schema";

const ZONES = ["salle", "terrasse", "bar", "vip"] as const;
const STATUSES = ["available", "occupied", "reserved"] as const;

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().uuid().openapi({ param: { name: "restaurantId", in: "path" } })
});

export const tableIdParamsSchema = z.object({
  restaurantId: z.string().uuid().openapi({ param: { name: "restaurantId", in: "path" } }),
  id: z.string().uuid().openapi({ param: { name: "id", in: "path" } })
});

export const restaurantTableSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  number: z.number().int().positive(),
  name: z.string().nullable(),
  capacity: z.number().int().positive(),
  zone: z.enum(ZONES),
  status: z.enum(STATUSES),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).openapi("RestaurantTable");

export const listTablesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  zone: z.enum(ZONES).optional(),
  status: z.enum(STATUSES).optional()
});

export const paginatedTablesSchema = paginationMetaSchema.extend({
  data: z.array(restaurantTableSchema)
}).openapi("PaginatedRestaurantTables");

export const createTableBodySchema = z.object({
  number: z.number().int().positive(),
  name: z.string().max(80).optional(),
  capacity: z.number().int().positive().default(2),
  zone: z.enum(ZONES).default("salle"),
  status: z.enum(STATUSES).default("available"),
  isActive: z.boolean().default(true)
}).openapi("CreateRestaurantTableBody");

export const updateTableBodySchema = z.object({
  number: z.number().int().positive().optional(),
  name: z.string().max(80).nullable().optional(),
  capacity: z.number().int().positive().optional(),
  zone: z.enum(ZONES).optional(),
  status: z.enum(STATUSES).optional(),
  isActive: z.boolean().optional()
}).openapi("UpdateRestaurantTableBody");

export const bulkGenerateBodySchema = z.object({
  count: z.number().int().positive().max(500),
  startNumber: z.number().int().positive().default(1),
  capacity: z.number().int().positive().default(2),
  zone: z.enum(ZONES).default("salle")
}).openapi("BulkGenerateTablesBody");
