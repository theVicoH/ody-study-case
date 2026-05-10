import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/restaurant-stats-api/restaurant-stats-api.service";

describe("restaurant-stats-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
