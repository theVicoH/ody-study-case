import { describe, expect, it } from "vitest";

import * as mod from "@/lib/restaurant-visuals/restaurant-visuals.util";

describe("restaurant-visuals.util", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
