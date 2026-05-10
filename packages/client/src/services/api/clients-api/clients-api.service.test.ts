import { describe, expect, it } from "vitest";

import * as mod from "@/services/api/clients-api/clients-api.service";

describe("clients-api.service", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
