import { describe, expect, test } from "vitest";

import { InvalidMoneyError } from "@/errors/shared/invalid-money/invalid-money.error";
import { Money } from "@/value-objects/shared/money/money.value-object";

describe("Money", () => {
  test("creates from integer cents", () => {
    expect(Money.fromCents(1250).toCents()).toBe(1250);
  });

  test("rejects negative or non-integer cents", () => {
    expect(() => Money.fromCents(-1)).toThrow(InvalidMoneyError);
    expect(() => Money.fromCents(1.5)).toThrow(InvalidMoneyError);
  });

  test("adds and multiplies", () => {
    const a = Money.fromCents(500);
    const b = Money.fromCents(300);

    expect(a.add(b).toCents()).toBe(800);
    expect(a.multiply(3).toCents()).toBe(1500);
  });

  test("multiply rejects negative", () => {
    expect(() => Money.fromCents(100).multiply(-2)).toThrow(InvalidMoneyError);
  });

  test("equals", () => {
    expect(Money.fromCents(100).equals(Money.fromCents(100))).toBe(true);
    expect(Money.fromCents(100).equals(Money.fromCents(200))).toBe(false);
  });
});
