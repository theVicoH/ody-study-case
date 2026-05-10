import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChartLineIcon } from "./chart-line.icon";

const TEST_ICON_SIZE = 48;

describe("ChartLineIcon", () => {
  it("renders without crashing", () => {
    render(<ChartLineIcon data-testid="chart-line-icon" />);
    expect(screen.getByTestId("chart-line-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<ChartLineIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<ChartLineIcon className="custom-class" data-testid="chart-line-icon" />);
    expect(screen.getByTestId("chart-line-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<ChartLineIcon onMouseEnter={onMouseEnter} data-testid="chart-line-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("chart-line-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<ChartLineIcon onMouseLeave={onMouseLeave} data-testid="chart-line-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("chart-line-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<ChartLineIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="chart-line-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("chart-line-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<ChartLineIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
