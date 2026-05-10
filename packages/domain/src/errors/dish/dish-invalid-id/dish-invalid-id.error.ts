export class DishInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid dish id: ${id}`);
    this.name = "DishInvalidIdError";
  }
}
