import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArrowDownIcon } from "./arrow-down.icon";

const TEST_ICON_SIZE = 48;

describe("ArrowDownIcon", () => {
  it("renders without crashing", () => {
    render(<ArrowDownIcon data-testid="arrow-down-icon" />);
    expect(screen.getByTestId("arrow-down-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<ArrowDownIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<ArrowDownIcon className="custom-class" data-testid="arrow-down-icon" />);
    expect(screen.getByTestId("arrow-down-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<ArrowDownIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="arrow-down-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("arrow-down-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<ArrowDownIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
