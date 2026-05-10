export class RestaurantNotFoundError extends Error {
  constructor(id: string) {
    super(`Restaurant not found: ${id}`);
    this.name = "RestaurantNotFoundError";
  }
}
