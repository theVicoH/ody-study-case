import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-dishes/use-dishes.hook";

describe("use-dishes.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
