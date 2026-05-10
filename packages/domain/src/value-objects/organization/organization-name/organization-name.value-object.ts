import { OrganizationInvalidNameError } from "@/errors/organization/organization-invalid-name/organization-invalid-name.error";

const MIN_LENGTH = 2;
const MAX_LENGTH = 80;

export class OrganizationName {
  private constructor(private readonly value: string) {}

  static create(value: string): OrganizationName {
    const trimmed = value?.trim() ?? "";

    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new OrganizationInvalidNameError(value);
    }

    return new OrganizationName(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
