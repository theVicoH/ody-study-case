import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/auth-api/auth-api.service";

describe("auth-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
