export class RestaurantInvalidNameError extends Error {
  constructor(name: string) {
    super(`Invalid restaurant name: ${name}`);
    this.name = "RestaurantInvalidNameError";
  }
}
