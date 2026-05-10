/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "@/routes/_shared/pagination.schema";

export const organizationParamsSchema = z.object({
  id: z.string().uuid().openapi({ param: { name: "id", in: "path" } })
});

export const organizationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).openapi("Organization");

export const createOrganizationBodySchema = z.object({
  name: z.string().min(2).max(80),
  ownerId: z.string().uuid()
}).openapi("CreateOrganizationBody");

export const updateOrganizationBodySchema = z.object({
  name: z.string().min(2).max(80).optional()
}).openapi("UpdateOrganizationBody");

export const listOrganizationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  ownerId: z.string().uuid().optional()
});

export const paginatedOrganizationsSchema = paginationMetaSchema.extend({
  data: z.array(organizationResponseSchema)
}).openapi("PaginatedOrganizations");
