export class OrderInvalidDataError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid order ${field}: ${String(value)}`);
    this.name = "OrderInvalidDataError";
  }
}
