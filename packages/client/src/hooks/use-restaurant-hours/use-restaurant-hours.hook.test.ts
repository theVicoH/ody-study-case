import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-restaurant-hours/use-restaurant-hours.hook";

describe("use-restaurant-hours.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
