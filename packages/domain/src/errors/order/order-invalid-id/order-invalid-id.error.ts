export class OrderInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid order id: ${id}`);
    this.name = "OrderInvalidIdError";
  }
}
