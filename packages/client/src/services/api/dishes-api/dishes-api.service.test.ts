import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/dishes-api/dishes-api.service";

describe("dishes-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
