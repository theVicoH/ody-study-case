import {
  UserNotFoundError,
  UserAlreadyExistsError
} from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { Context } from "hono";

export const onError = (err: Error, c: Context): Response => {
  if (err instanceof UserNotFoundError) {
    return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
  }
  if (err instanceof UserAlreadyExistsError) {
    return c.json({ error: err.message }, HttpStatus.CONFLICT);
  }

  c.var.logger.error({ err }, "Unhandled error");

  return c.json({ error: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const notFound = (c: Context): Response => {
  return c.json({ error: "Not found" }, HttpStatus.NOT_FOUND);
};
