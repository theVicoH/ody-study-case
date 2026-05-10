import { describe, expect, test } from "vitest";

import { OrganizationAlreadyExistsError } from "@/errors/organization/organization-already-exists/organization-already-exists.error";

describe("OrganizationAlreadyExistsError", () => {
  test("should have name OrganizationAlreadyExistsError", () => {
    const error = new OrganizationAlreadyExistsError("Acme");

    expect(error.name).toBe("OrganizationAlreadyExistsError");
  });

  test("should include name in message", () => {
    const error = new OrganizationAlreadyExistsError("Acme");

    expect(error.message).toBe("Organization already exists: Acme");
  });
});
