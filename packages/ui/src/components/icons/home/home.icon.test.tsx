import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HouseIcon } from "./home.icon";

const TEST_ICON_SIZE = 48;

describe("HouseIcon", () => {
  it("renders without crashing", () => {
    render(<HouseIcon data-testid="house-icon" />);
    expect(screen.getByTestId("house-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<HouseIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<HouseIcon className="custom-class" data-testid="house-icon" />);
    expect(screen.getByTestId("house-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<HouseIcon onMouseEnter={onMouseEnter} data-testid="house-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("house-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<HouseIcon onMouseLeave={onMouseLeave} data-testid="house-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("house-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<HouseIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="house-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("house-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<HouseIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
