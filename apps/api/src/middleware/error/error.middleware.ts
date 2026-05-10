import {
  OrganizationAlreadyExistsError,
  OrganizationInvalidIdError,
  OrganizationInvalidNameError,
  OrganizationNotFoundError,
  RestaurantInvalidIdError,
  RestaurantInvalidNameError,
  RestaurantInvalidSettingsError,
  RestaurantNotFoundError,
  UserAlreadyExistsError,
  UserInvalidEmailError,
  UserInvalidIdError,
  UserNotFoundError
} from "@workspace/domain";
import { HttpStatus } from "@workspace/shared";

import type { Context } from "hono";

const NOT_FOUND_ERRORS = [UserNotFoundError, OrganizationNotFoundError, RestaurantNotFoundError];
const CONFLICT_ERRORS = [UserAlreadyExistsError, OrganizationAlreadyExistsError];
const VALIDATION_ERRORS = [
  UserInvalidEmailError,
  UserInvalidIdError,
  OrganizationInvalidIdError,
  OrganizationInvalidNameError,
  RestaurantInvalidIdError,
  RestaurantInvalidNameError,
  RestaurantInvalidSettingsError
];

export const onError = (err: Error, c: Context): Response => {
  if (NOT_FOUND_ERRORS.some((E) => err instanceof E)) {
    return c.json({ error: err.message }, HttpStatus.NOT_FOUND);
  }

  if (CONFLICT_ERRORS.some((E) => err instanceof E)) {
    return c.json({ error: err.message }, HttpStatus.CONFLICT);
  }

  if (VALIDATION_ERRORS.some((E) => err instanceof E)) {
    return c.json({ error: err.message }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  c.var.logger.error({ err }, "Unhandled error");

  return c.json({ error: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const notFound = (c: Context): Response => {
  return c.json({ error: "Not found" }, HttpStatus.NOT_FOUND);
};
