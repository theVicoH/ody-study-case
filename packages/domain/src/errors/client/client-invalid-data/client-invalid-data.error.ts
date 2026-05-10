export class ClientInvalidDataError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid client ${field}: ${String(value)}`);
    this.name = "ClientInvalidDataError";
  }
}
