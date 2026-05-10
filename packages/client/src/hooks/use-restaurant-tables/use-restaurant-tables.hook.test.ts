import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-restaurant-tables/use-restaurant-tables.hook";

describe("use-restaurant-tables.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
