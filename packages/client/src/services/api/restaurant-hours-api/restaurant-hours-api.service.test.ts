import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/restaurant-hours-api/restaurant-hours-api.service";

describe("restaurant-hours-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
