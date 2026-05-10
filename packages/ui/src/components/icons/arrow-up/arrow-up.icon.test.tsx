import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArrowUpIcon } from "./arrow-up.icon";

const TEST_ICON_SIZE = 48;

describe("ArrowUpIcon", () => {
  it("renders without crashing", () => {
    render(<ArrowUpIcon data-testid="arrow-up-icon" />);
    expect(screen.getByTestId("arrow-up-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<ArrowUpIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<ArrowUpIcon className="custom-class" data-testid="arrow-up-icon" />);
    expect(screen.getByTestId("arrow-up-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<ArrowUpIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="arrow-up-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("arrow-up-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<ArrowUpIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
