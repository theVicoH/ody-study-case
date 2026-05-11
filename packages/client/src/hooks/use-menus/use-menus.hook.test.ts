import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-menus/use-menus.hook";

describe("use-menus.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
