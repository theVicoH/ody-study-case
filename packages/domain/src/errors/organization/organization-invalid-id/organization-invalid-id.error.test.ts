import { describe, expect, test } from "vitest";

import { OrganizationInvalidIdError } from "@/errors/organization/organization-invalid-id/organization-invalid-id.error";

describe("OrganizationInvalidIdError", () => {
  test("should have name OrganizationInvalidIdError", () => {
    const error = new OrganizationInvalidIdError("");

    expect(error.name).toBe("OrganizationInvalidIdError");
  });

  test("should include id in message", () => {
    const error = new OrganizationInvalidIdError("abc");

    expect(error.message).toBe("Invalid organization id: abc");
  });
});
