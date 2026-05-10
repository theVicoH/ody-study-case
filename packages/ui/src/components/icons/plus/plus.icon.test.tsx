import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PlusIcon } from "./plus.icon";

const TEST_ICON_SIZE = 48;

describe("PlusIcon", () => {
  it("renders without crashing", () => {
    render(<PlusIcon data-testid="plus-icon" />);
    expect(screen.getByTestId("plus-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<PlusIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<PlusIcon className="custom-class" data-testid="plus-icon" />);
    expect(screen.getByTestId("plus-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<PlusIcon onMouseEnter={onMouseEnter} data-testid="plus-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("plus-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<PlusIcon onMouseLeave={onMouseLeave} data-testid="plus-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("plus-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<PlusIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="plus-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("plus-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<PlusIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
