import { describe, expect, it } from "vitest";

import { MOTION_DURATION, MOTION_EASE, MOTION_SPRING } from "./motion-tokens.util";

describe("MOTION_DURATION", () => {
  it("has all expected keys", () => {
    expect(Object.keys(MOTION_DURATION)).toEqual(["instant", "fast", "base", "slow", "slower"]);
  });

  it("instant is 0", () => {
    expect(MOTION_DURATION.instant).toBe(0);
  });

  it("all non-instant durations are positive and in seconds", () => {
    const { instant: _instant, ...rest } = MOTION_DURATION;

    for (const value of Object.values(rest)) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(10);
    }
  });

  it("durations are ordered ascending", () => {
    expect(MOTION_DURATION.fast).toBeLessThan(MOTION_DURATION.base);
    expect(MOTION_DURATION.base).toBeLessThan(MOTION_DURATION.slow);
    expect(MOTION_DURATION.slow).toBeLessThan(MOTION_DURATION.slower);
  });
});

describe("MOTION_EASE", () => {
  it("has all expected keys", () => {
    expect(Object.keys(MOTION_EASE)).toEqual(["linear", "in", "out", "inOut", "emphasized", "bounce"]);
  });

  it("each easing is an array of 4 numbers", () => {
    for (const value of Object.values(MOTION_EASE)) {
      expect(value).toHaveLength(4);

      for (const n of value) {
        expect(typeof n).toBe("number");
      }
    }
  });
});

describe("MOTION_SPRING", () => {
  it("has all expected keys", () => {
    expect(Object.keys(MOTION_SPRING)).toEqual(["soft", "default", "snappy"]);
  });

  it("each spring has type, stiffness and damping", () => {
    for (const value of Object.values(MOTION_SPRING)) {
      expect(value.type).toBe("spring");
      expect(value.stiffness).toBeGreaterThan(0);
      expect(value.damping).toBeGreaterThan(0);
    }
  });

  it("snappy is stiffer than default which is stiffer than soft", () => {
    expect(MOTION_SPRING.snappy.stiffness).toBeGreaterThan(MOTION_SPRING.default.stiffness);
    expect(MOTION_SPRING.default.stiffness).toBeGreaterThan(MOTION_SPRING.soft.stiffness);
  });
});
