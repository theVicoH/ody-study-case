import { describe, expect, it } from "vitest";

import { buildQuery } from "./build-query.util";

describe("buildQuery", () => {
  it("returns an empty string when no values are provided", () => {
    expect(buildQuery({})).toBe("");
  });

  it("skips null, undefined, and empty-string values", () => {
    expect(buildQuery({ a: null, b: undefined, c: "" })).toBe("");
  });

  it("serialises strings, numbers, and booleans", () => {
    expect(buildQuery({ page: 1, limit: 10, active: true })).toBe("?page=1&limit=10&active=true");
  });

  it("encodes reserved characters in keys and values", () => {
    expect(buildQuery({ "q&": "a b" })).toBe("?q%26=a%20b");
  });
});
