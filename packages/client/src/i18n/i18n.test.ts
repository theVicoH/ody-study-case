import { describe, it, expect } from "vitest";

import { i18n } from "@/i18n/index";

describe("i18n", () => {
  it("is initialized", () => {
    expect(i18n.isInitialized).toBe(true);
  });

  it("has common namespace in English", () => {
    expect(i18n.getResourceBundle("en", "common")).toBeDefined();
  });

  it("has common namespace in French", () => {
    expect(i18n.getResourceBundle("fr", "common")).toBeDefined();
  });
});
