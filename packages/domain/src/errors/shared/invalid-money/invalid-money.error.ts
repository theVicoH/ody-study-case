export class InvalidMoneyError extends Error {
  constructor(value: number) {
    super(`Invalid money amount: ${value}`);
    this.name = "InvalidMoneyError";
  }
}
