import { describe, expect, test } from "vitest";

import { Organization } from "@/entities/organization/organization.entity";
import { OrganizationName } from "@/value-objects/organization/organization-name/organization-name.value-object";
import { UserId } from "@/value-objects/user/user-id/user-id.value-object";

const ownerId = UserId.generate();
const orgName = OrganizationName.create("Acme");

describe("Organization", () => {
  test("should create with id, name, ownerId, timestamps", () => {
    const org = Organization.create(orgName, ownerId);

    expect(org.id.toString()).toBeDefined();
    expect(org.name.toString()).toBe("Acme");
    expect(org.ownerId.toString()).toBe(ownerId.toString());
    expect(org.createdAt).toBeInstanceOf(Date);
    expect(org.updatedAt.getTime()).toBe(org.createdAt.getTime());
  });

  test("should rename and bump updatedAt", async () => {
    const org = Organization.create(orgName, ownerId);

    await new Promise((r) => setTimeout(r, 1));
    const renamed = org.rename(OrganizationName.create("Globex"));

    expect(renamed.name.toString()).toBe("Globex");
    expect(renamed.id).toBe(org.id);
    expect(renamed.createdAt).toBe(org.createdAt);
    expect(renamed.updatedAt.getTime()).toBeGreaterThanOrEqual(org.updatedAt.getTime());
  });
});
