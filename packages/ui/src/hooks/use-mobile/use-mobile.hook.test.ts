import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { useIsMobile } from "./use-mobile.hook";

const MOBILE_BREAKPOINT = 768;

describe("useIsMobile", () => {
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    listeners = [];

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: (_: string, cb: () => void) => {
          listeners.push(cb);
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when window width is at or above breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: MOBILE_BREAKPOINT });
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("returns true when window width is below breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: MOBILE_BREAKPOINT - 1 });
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("updates when media query fires", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: MOBILE_BREAKPOINT });
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: MOBILE_BREAKPOINT - 1 });
      listeners.forEach((cb) => cb());
    });

    expect(result.current).toBe(true);
  });
});
