/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "@/routes/_shared/pagination.schema";

export const userParamsSchema = z.object({
  id: z.string().uuid().openapi({ param: { name: "id", in: "path" }, example: "00000000-0000-0000-0000-000000000000" })
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  birthday: z.string().datetime(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).openapi("User");

export const createUserBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthday: z.string().datetime()
}).openapi("CreateUserBody");

export const updateUserBodySchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  image: z.string().url().nullable().optional()
}).openapi("UpdateUserBody");

export const paginatedUsersSchema = paginationMetaSchema.extend({
  data: z.array(userResponseSchema)
}).openapi("PaginatedUsers");
