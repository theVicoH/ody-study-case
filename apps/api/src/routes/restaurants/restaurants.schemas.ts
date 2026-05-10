/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "@/routes/_shared/pagination.schema";

export const restaurantParamsSchema = z.object({
  id: z.string().uuid().openapi({ param: { name: "id", in: "path" } })
});

export const restaurantResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  maxCovers: z.number().int().positive(),
  tableService: z.boolean(),
  clickAndCollect: z.boolean(),
  kitchenNotifications: z.boolean(),
  testMode: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).openapi("Restaurant");

export const createRestaurantBodySchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(2).max(80),
  address: z.string().min(3),
  phone: z.string().min(1).max(32),
  maxCovers: z.number().int().positive(),
  tableService: z.boolean().optional(),
  clickAndCollect: z.boolean().optional(),
  kitchenNotifications: z.boolean().optional(),
  testMode: z.boolean().optional()
}).openapi("CreateRestaurantBody");

export const updateRestaurantBodySchema = z.object({
  name: z.string().min(2).max(80).optional()
}).openapi("UpdateRestaurantBody");

export const updateRestaurantSettingsBodySchema = z.object({
  address: z.string().min(3).optional(),
  phone: z.string().min(1).max(32).optional(),
  maxCovers: z.number().int().positive().optional(),
  tableService: z.boolean().optional(),
  clickAndCollect: z.boolean().optional(),
  kitchenNotifications: z.boolean().optional(),
  testMode: z.boolean().optional()
}).openapi("UpdateRestaurantSettingsBody");

export const listRestaurantsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  organizationId: z.string().uuid().optional()
});

export const paginatedRestaurantsSchema = paginationMetaSchema.extend({
  data: z.array(restaurantResponseSchema)
}).openapi("PaginatedRestaurants");
