export class RestaurantInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid restaurant id: ${id}`);
    this.name = "RestaurantInvalidIdError";
  }
}
