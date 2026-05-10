export class ClientInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid client id: ${id}`);
    this.name = "ClientInvalidIdError";
  }
}
