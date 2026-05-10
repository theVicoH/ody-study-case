/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const paginationQuery = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : DEFAULT_PAGE))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : DEFAULT_LIMIT))
    .pipe(z.number().int().positive().max(MAX_LIMIT))
});

export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative()
});

export const errorSchema = z.object({ error: z.string() });
