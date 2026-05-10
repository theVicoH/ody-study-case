export class OrganizationInvalidNameError extends Error {
  constructor(name: string) {
    super(`Invalid organization name: ${name}`);
    this.name = "OrganizationInvalidNameError";
  }
}
