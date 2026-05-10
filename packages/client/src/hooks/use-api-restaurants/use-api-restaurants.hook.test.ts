import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

describe("use-api-restaurants.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
