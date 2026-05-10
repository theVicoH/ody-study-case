/* eslint-disable custom/enforce-file-suffix */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db, restaurantOpeningHoursTable } from "@workspace/database";
import { HttpStatus } from "@workspace/shared";
import { eq } from "drizzle-orm";

import type { AppEnv } from "@/types/app-env.types";

import { errorSchema } from "@/routes/_shared/pagination.schema";
import {
  openingHoursListSchema,
  restaurantIdParamSchema,
  upsertOpeningHoursBodySchema
} from "@/routes/restaurant-opening-hours/restaurant-opening-hours.schemas";

const tags = ["Restaurant Opening Hours"];

const listRoute = createRoute({
  method: "get",
  path: "/{restaurantId}/opening-hours",
  tags,
  request: { params: restaurantIdParamSchema },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: openingHoursListSchema } }, description: "Opening hours" }
  }
});

const upsertRoute = createRoute({
  method: "put",
  path: "/{restaurantId}/opening-hours",
  tags,
  request: {
    params: restaurantIdParamSchema,
    body: { content: { "application/json": { schema: upsertOpeningHoursBodySchema } } }
  },
  responses: {
    [HttpStatus.OK]: { content: { "application/json": { schema: openingHoursListSchema } }, description: "Updated opening hours" },
    [HttpStatus.UNPROCESSABLE_ENTITY]: { content: { "application/json": { schema: errorSchema } }, description: "Invalid" }
  }
});

export const restaurantOpeningHoursRouter = new OpenAPIHono<AppEnv>()
  .openapi(listRoute, async (c) => {
    const { restaurantId } = c.req.valid("param");
    const rows = await db
      .select()
      .from(restaurantOpeningHoursTable)
      .where(eq(restaurantOpeningHoursTable.restaurantId, restaurantId));

    return c.json({
      data: rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        isOpen: r.isOpen,
        openTime: r.openTime,
        closeTime: r.closeTime
      }))
    }, HttpStatus.OK);
  })
  .openapi(upsertRoute, async (c) => {
    const { restaurantId } = c.req.valid("param");
    const { hours } = c.req.valid("json");
    const now = new Date();

    for (const h of hours) {
      await db
        .insert(restaurantOpeningHoursTable)
        .values({
          restaurantId,
          dayOfWeek: h.dayOfWeek,
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime,
          createdAt: now,
          updatedAt: now
        })
        .onConflictDoUpdate({
          target: [restaurantOpeningHoursTable.restaurantId, restaurantOpeningHoursTable.dayOfWeek],
          set: {
            isOpen: h.isOpen,
            openTime: h.openTime,
            closeTime: h.closeTime,
            updatedAt: now
          }
        });
    }

    const rows = await db
      .select()
      .from(restaurantOpeningHoursTable)
      .where(eq(restaurantOpeningHoursTable.restaurantId, restaurantId));

    return c.json({
      data: rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        isOpen: r.isOpen,
        openTime: r.openTime,
        closeTime: r.closeTime
      }))
    }, HttpStatus.OK);
  });
