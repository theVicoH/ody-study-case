import { describe, expect, test } from "vitest";

import { OrganizationInvalidNameError } from "@/errors/organization/organization-invalid-name/organization-invalid-name.error";
import { OrganizationName } from "@/value-objects/organization/organization-name/organization-name.value-object";

describe("OrganizationName", () => {
  test("should create with valid name", () => {
    const name = OrganizationName.create("Acme");

    expect(name.toString()).toBe("Acme");
  });

  test("should trim", () => {
    expect(OrganizationName.create("  Acme  ").toString()).toBe("Acme");
  });

  test("should throw on too short", () => {
    expect(() => OrganizationName.create("A")).toThrow(OrganizationInvalidNameError);
  });

  test("should throw on empty", () => {
    expect(() => OrganizationName.create("")).toThrow(OrganizationInvalidNameError);
  });

  test("should throw on too long", () => {
    expect(() => OrganizationName.create("a".repeat(81))).toThrow(OrganizationInvalidNameError);
  });
});
