import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SlidersHorizontalIcon } from "./sliders-horizontal.icon";

const TEST_ICON_SIZE = 48;

describe("SlidersHorizontalIcon", () => {
  it("renders without crashing", () => {
    render(<SlidersHorizontalIcon data-testid="sliders-horizontal-icon" />);
    expect(screen.getByTestId("sliders-horizontal-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<SlidersHorizontalIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<SlidersHorizontalIcon className="custom-class" data-testid="sliders-horizontal-icon" />);
    expect(screen.getByTestId("sliders-horizontal-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<SlidersHorizontalIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="sliders-horizontal-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("sliders-horizontal-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<SlidersHorizontalIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
