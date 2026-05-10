import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-orders/use-orders.hook";

describe("use-orders.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
