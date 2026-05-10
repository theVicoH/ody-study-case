import { randomUUID } from "crypto";

import { OrganizationInvalidIdError } from "@/errors/organization/organization-invalid-id/organization-invalid-id.error";

export class OrganizationId {
  private constructor(private readonly value: string) {}

  static create(value: string): OrganizationId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new OrganizationInvalidIdError(value);
    }

    return new OrganizationId(trimmed);
  }

  static generate(): OrganizationId {
    return new OrganizationId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
