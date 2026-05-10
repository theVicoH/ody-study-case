import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/restaurant-tables-api/restaurant-tables-api.service";

describe("restaurant-tables-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
