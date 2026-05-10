export class OrganizationAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Organization already exists: ${name}`);
    this.name = "OrganizationAlreadyExistsError";
  }
}
