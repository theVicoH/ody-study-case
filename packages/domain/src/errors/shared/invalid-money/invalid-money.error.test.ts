import { describe, expect, test } from "vitest";

import { InvalidMoneyError } from "@/errors/shared/invalid-money/invalid-money.error";

describe("InvalidMoneyError", () => {
  test("should have name", () => {
    expect(new InvalidMoneyError(-1).name).toBe("InvalidMoneyError");
  });

  test("should include amount", () => {
    expect(new InvalidMoneyError(-1).message).toBe("Invalid money amount: -1");
  });
});
