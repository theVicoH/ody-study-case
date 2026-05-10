import { describe, expect, it } from "vitest";

import {
  averageValues,
  deltaDirectionFrom,
  formatPercentDelta,
  indexOfMax,
  indexOfMin,
  labelAtIndex,
  minValueOf,
  peakValue,
  sumValues
} from "./stats.util";

describe("sumValues", () => {
  it("returns 0 for empty array", () => {
    expect(sumValues([])).toBe(0);
  });

  it("sums all values", () => {
    expect(sumValues([1, 2, 3, 4])).toBe(10);
  });
});

describe("averageValues", () => {
  it("returns 0 for empty array", () => {
    expect(averageValues([])).toBe(0);
  });

  it("computes the mean", () => {
    expect(averageValues([2, 4, 6])).toBe(4);
  });
});

describe("peakValue / minValueOf", () => {
  it("returns 0 for empty array", () => {
    expect(peakValue([])).toBe(0);
    expect(minValueOf([])).toBe(0);
  });

  it("returns the max and min", () => {
    expect(peakValue([3, 1, 4, 1, 5])).toBe(5);
    expect(minValueOf([3, 1, 4, 1, 5])).toBe(1);
  });
});

describe("indexOfMax / indexOfMin", () => {
  it("returns -1 for empty array", () => {
    expect(indexOfMax([])).toBe(-1);
    expect(indexOfMin([])).toBe(-1);
  });

  it("returns first occurrence index", () => {
    expect(indexOfMax([1, 5, 3, 5])).toBe(1);
    expect(indexOfMin([4, 1, 2, 1])).toBe(1);
  });
});

describe("formatPercentDelta", () => {
  it("returns dash when fewer than 2 values", () => {
    expect(formatPercentDelta([])).toBe("—");
    expect(formatPercentDelta([10])).toBe("—");
  });

  it("returns dash when previous half sums to zero", () => {
    expect(formatPercentDelta([0, 0, 5, 5])).toBe("—");
  });

  it("formats positive deltas with + sign", () => {
    expect(formatPercentDelta([10, 10, 20, 20])).toBe("+100%");
  });

  it("formats negative deltas with - sign", () => {
    expect(formatPercentDelta([20, 20, 10, 10])).toBe("-50%");
  });
});

describe("deltaDirectionFrom", () => {
  it("returns down for negative deltas", () => {
    expect(deltaDirectionFrom("-12.5%")).toBe("down");
  });

  it("returns up for positive or neutral deltas", () => {
    expect(deltaDirectionFrom("+5%")).toBe("up");
    expect(deltaDirectionFrom("—")).toBe("up");
  });
});

describe("labelAtIndex", () => {
  it("returns fallback for negative index", () => {
    expect(labelAtIndex(["a", "b"], -1)).toBe("—");
  });

  it("returns label at index when present", () => {
    expect(labelAtIndex(["a", "b"], 1)).toBe("b");
  });

  it("returns fallback when index is out of bounds", () => {
    expect(labelAtIndex(["a"], 5)).toBe("—");
  });
});
