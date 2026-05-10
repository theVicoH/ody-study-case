export class OrganizationInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid organization id: ${id}`);
    this.name = "OrganizationInvalidIdError";
  }
}
