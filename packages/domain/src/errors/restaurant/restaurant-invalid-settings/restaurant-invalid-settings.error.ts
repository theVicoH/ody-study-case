export class RestaurantInvalidSettingsError extends Error {
  constructor(reason: string) {
    super(`Invalid restaurant settings: ${reason}`);
    this.name = "RestaurantInvalidSettingsError";
  }
}
