import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PanelRightIcon } from "./panel-right.icon";

const TEST_ICON_SIZE = 48;

describe("PanelRightIcon", () => {
  it("renders without crashing", () => {
    render(<PanelRightIcon data-testid="panel-right-icon" />);
    expect(screen.getByTestId("panel-right-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<PanelRightIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<PanelRightIcon className="custom-class" data-testid="panel-right-icon" />);
    expect(screen.getByTestId("panel-right-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<PanelRightIcon onMouseEnter={onMouseEnter} data-testid="panel-right-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("panel-right-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<PanelRightIcon onMouseLeave={onMouseLeave} data-testid="panel-right-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("panel-right-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<PanelRightIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="panel-right-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("panel-right-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<PanelRightIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
