/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HttpStatus } from "@workspace/shared";

import type { AppEnv } from "@/types/app-env.types";

import { container } from "@/infrastructure/container/container";

const tags = ["Stats"];

const topItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  priceCents: z.number().int().nonnegative(),
  sold: z.number().int().nonnegative()
});

const statsSchema = z.object({
  todayRevenueCents: z.number().int().nonnegative(),
  todayCovers: z.number().int().nonnegative(),
  avgTicketCents: z.number().int().nonnegative(),
  fillRate: z.number().int().min(0).max(100),
  weeklyRevenueCents: z.array(z.number().int().nonnegative()),
  monthlyRevenueCents: z.array(z.number().int().nonnegative()),
  yearlyRevenueCents: z.array(z.number().int().nonnegative()),
  heatmap: z.array(z.array(z.number().min(0).max(1))),
  topItems: z.array(topItemSchema),
  sparklineData: z.array(z.number().min(0).max(1)),
  customers: z.number().int().nonnegative(),
  openOrders: z.number().int().nonnegative(),
  covers: z.number().int().nonnegative(),
  revenueCents: z.number().int().nonnegative(),
  orders: z.number().int().nonnegative(),
  trendPercent: z.number(),
  rating: z.number()
});

const restaurantIdParam = z.object({ restaurantId: z.string().uuid() });

const groupQuery = z.object({
  restaurantIds: z
    .string()
    .min(1)
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean))
    .pipe(z.array(z.string().uuid()).min(1))
});

export const restaurantStatsRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/{restaurantId}/stats",
      tags,
      request: { params: restaurantIdParam },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: statsSchema } }, description: "Stats" }
      }
    }),
    async (c) => {
      const { restaurantId } = c.req.valid("param");
      const result = await container.restaurantStats.get.execute({ restaurantId });

      return c.json(result, HttpStatus.OK);
    }
  );

export const groupStatsRouter = new OpenAPIHono<AppEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/group",
      tags,
      request: { query: groupQuery },
      responses: {
        [HttpStatus.OK]: { content: { "application/json": { schema: statsSchema } }, description: "Group stats" }
      }
    }),
    async (c) => {
      const { restaurantIds } = c.req.valid("query");
      const result = await container.restaurantStats.getGroup.execute({ restaurantIds });

      return c.json(result, HttpStatus.OK);
    }
  );
