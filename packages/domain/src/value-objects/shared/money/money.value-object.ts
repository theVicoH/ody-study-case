import { InvalidMoneyError } from "@/errors/shared/invalid-money/invalid-money.error";

export class Money {
  private constructor(private readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new InvalidMoneyError(cents);
    }

    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  multiply(factor: number): Money {
    if (!Number.isInteger(factor) || factor < 0) {
      throw new InvalidMoneyError(factor);
    }

    return new Money(this.cents * factor);
  }

  toCents(): number {
    return this.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }
}
