/* eslint-disable custom/enforce-file-suffix */
import { z } from "@hono/zod-openapi";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().uuid().openapi({ param: { name: "restaurantId", in: "path" } })
});

export const openingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().regex(TIME_REGEX),
  closeTime: z.string().regex(TIME_REGEX)
}).openapi("RestaurantOpeningHour");

export const openingHoursListSchema = z.object({
  data: z.array(openingHourSchema)
}).openapi("RestaurantOpeningHoursList");

export const upsertOpeningHoursBodySchema = z.object({
  hours: z.array(openingHourSchema).min(1).max(7)
}).openapi("UpsertOpeningHoursBody");
