import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArrowDownUpIcon } from "./arrow-down-up.icon";

const TEST_ICON_SIZE = 48;

describe("ArrowDownUpIcon", () => {
  it("renders without crashing", () => {
    render(<ArrowDownUpIcon data-testid="arrow-down-up-icon" />);
    expect(screen.getByTestId("arrow-down-up-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<ArrowDownUpIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<ArrowDownUpIcon className="custom-class" data-testid="arrow-down-up-icon" />);
    expect(screen.getByTestId("arrow-down-up-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<ArrowDownUpIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="arrow-down-up-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("arrow-down-up-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<ArrowDownUpIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
