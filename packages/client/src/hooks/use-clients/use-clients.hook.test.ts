import { describe, expect, it } from "vitest";

import * as mod from "@/hooks/use-clients/use-clients.hook";

describe("use-clients.hook", () => {
  it("exports symbols", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
