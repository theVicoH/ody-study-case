import { describe, expect, test } from "vitest";

import { OrganizationInvalidIdError } from "@/errors/organization/organization-invalid-id/organization-invalid-id.error";
import { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";

describe("OrganizationId", () => {
  test("should create with a valid value", () => {
    const id = OrganizationId.create("abc");

    expect(id.toString()).toBe("abc");
  });

  test("should trim value", () => {
    const id = OrganizationId.create("  abc  ");

    expect(id.toString()).toBe("abc");
  });

  test("should throw on empty value", () => {
    expect(() => OrganizationId.create("")).toThrow(OrganizationInvalidIdError);
  });

  test("should throw on whitespace-only value", () => {
    expect(() => OrganizationId.create("   ")).toThrow(OrganizationInvalidIdError);
  });

  test("should generate a UUID", () => {
    const id = OrganizationId.generate();

    expect(id.toString()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
