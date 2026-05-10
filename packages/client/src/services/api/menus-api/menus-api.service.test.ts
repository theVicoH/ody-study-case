import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/menus-api/menus-api.service";

describe("menus-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
