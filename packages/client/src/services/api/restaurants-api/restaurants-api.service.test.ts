import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/restaurants-api/restaurants-api.service";

describe("restaurants-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
