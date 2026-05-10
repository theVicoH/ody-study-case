import { describe, expect, it } from "vitest";

import * as mod from "@/lib/restaurant-visuals/restaurant-models-storage.util";

describe("restaurant-models-storage.util", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
