export class MenuNotFoundError extends Error {
  constructor(id: string) {
    super(`Menu not found: ${id}`);
    this.name = "MenuNotFoundError";
  }
}
