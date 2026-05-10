import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/orders-api/orders-api.service";

describe("orders-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
