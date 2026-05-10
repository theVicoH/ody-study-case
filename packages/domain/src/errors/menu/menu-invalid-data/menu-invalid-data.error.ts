export class MenuInvalidDataError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid menu ${field}: ${String(value)}`);
    this.name = "MenuInvalidDataError";
  }
}
