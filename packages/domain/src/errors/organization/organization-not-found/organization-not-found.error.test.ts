import { describe, expect, test } from "vitest";

import { OrganizationNotFoundError } from "@/errors/organization/organization-not-found/organization-not-found.error";

describe("OrganizationNotFoundError", () => {
  test("should have name OrganizationNotFoundError", () => {
    const error = new OrganizationNotFoundError("abc");

    expect(error.name).toBe("OrganizationNotFoundError");
  });

  test("should include id in message", () => {
    const error = new OrganizationNotFoundError("abc");

    expect(error.message).toBe("Organization not found: abc");
  });
});
