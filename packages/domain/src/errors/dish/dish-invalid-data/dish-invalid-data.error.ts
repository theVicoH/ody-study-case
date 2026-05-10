export class DishInvalidDataError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid dish ${field}: ${String(value)}`);
    this.name = "DishInvalidDataError";
  }
}
