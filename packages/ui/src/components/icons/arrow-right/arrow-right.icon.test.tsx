import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArrowRightIcon } from "./arrow-right.icon";

const TEST_ICON_SIZE = 48;

describe("ArrowRightIcon", () => {
  it("renders without crashing", () => {
    render(<ArrowRightIcon data-testid="arrow-right-icon" />);
    expect(screen.getByTestId("arrow-right-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<ArrowRightIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<ArrowRightIcon className="custom-class" data-testid="arrow-right-icon" />);
    expect(screen.getByTestId("arrow-right-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<ArrowRightIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="arrow-right-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("arrow-right-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<ArrowRightIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
