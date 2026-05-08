import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGridOverlay } from "./use-grid-overlay.hook";

const ctrlG = (): KeyboardEvent =>
  new KeyboardEvent("keydown", { key: "g", ctrlKey: true, bubbles: true });

describe("useGridOverlay", () => {
  it("starts hidden", () => {
    const { result } = renderHook(() => useGridOverlay());

    expect(result.current.visible).toBe(false);
  });

  it("toggles visible on Ctrl+G", () => {
    const { result } = renderHook(() => useGridOverlay());

    act(() => window.dispatchEvent(ctrlG()));
    expect(result.current.visible).toBe(true);

    act(() => window.dispatchEvent(ctrlG()));
    expect(result.current.visible).toBe(false);
  });

  it("toggles via toggle()", () => {
    const { result } = renderHook(() => useGridOverlay());

    act(() => result.current.toggle());
    expect(result.current.visible).toBe(true);
  });

  it("removes listener on unmount", () => {
    const { result, unmount } = renderHook(() => useGridOverlay());

    unmount();
    act(() => window.dispatchEvent(ctrlG()));

    expect(result.current.visible).toBe(false);
  });
});
