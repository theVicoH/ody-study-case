export class MenuInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid menu id: ${id}`);
    this.name = "MenuInvalidIdError";
  }
}
