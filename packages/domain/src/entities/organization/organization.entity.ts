import type { OrganizationName } from "@/value-objects/organization/organization-name/organization-name.value-object";
import type { UserId } from "@/value-objects/user/user-id/user-id.value-object";

import { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";


export class Organization {
  private constructor(
    public readonly id: OrganizationId,
    public readonly name: OrganizationName,
    public readonly ownerId: UserId,
    public readonly updatedAt: Date,
    public readonly createdAt: Date
  ) {}

  static create(name: OrganizationName, ownerId: UserId): Organization {
    const now = new Date();

    return new Organization(OrganizationId.generate(), name, ownerId, now, now);
  }

  static reconstitute(
    id: OrganizationId,
    name: OrganizationName,
    ownerId: UserId,
    updatedAt: Date,
    createdAt: Date
  ): Organization {
    return new Organization(id, name, ownerId, updatedAt, createdAt);
  }

  rename(name: OrganizationName): Organization {
    return new Organization(this.id, name, this.ownerId, new Date(), this.createdAt);
  }
}
