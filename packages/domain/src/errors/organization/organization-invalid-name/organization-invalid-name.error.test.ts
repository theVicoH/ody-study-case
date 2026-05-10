import { describe, expect, test } from "vitest";

import { OrganizationInvalidNameError } from "@/errors/organization/organization-invalid-name/organization-invalid-name.error";

describe("OrganizationInvalidNameError", () => {
  test("should have name OrganizationInvalidNameError", () => {
    const error = new OrganizationInvalidNameError("");

    expect(error.name).toBe("OrganizationInvalidNameError");
  });

  test("should include name in message", () => {
    const error = new OrganizationInvalidNameError("");

    expect(error.message).toBe("Invalid organization name: ");
  });
});
