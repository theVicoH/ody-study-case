import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBreakpoint } from "./use-breakpoint.hook";

const setWidth = (value: number): void => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value });
};

describe("useBreakpoint", () => {
  beforeEach(() => {
    setWidth(1280);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns desktop for width >= 1024", () => {
    setWidth(1280);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobileOrTablet).toBe(false);
  });

  it("returns tablet for width between 768 and 1023", () => {
    setWidth(900);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobileOrTablet).toBe(true);
  });

  it("returns mobile for width <= 767", () => {
    setWidth(500);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isMobileOrTablet).toBe(true);
  });

  it("updates on window resize", () => {
    setWidth(1280);
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isDesktop).toBe(true);

    act(() => {
      setWidth(500);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isMobile).toBe(true);
  });
});
