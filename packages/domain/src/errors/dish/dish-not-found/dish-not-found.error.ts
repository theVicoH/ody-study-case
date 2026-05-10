export class DishNotFoundError extends Error {
  constructor(id: string) {
    super(`Dish not found: ${id}`);
    this.name = "DishNotFoundError";
  }
}
