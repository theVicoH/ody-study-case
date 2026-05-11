import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/organizations-api/organizations-api.service";

describe("organizations-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
