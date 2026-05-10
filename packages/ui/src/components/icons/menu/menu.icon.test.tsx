import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MenuIcon } from "./menu.icon";

const TEST_ICON_SIZE = 48;

describe("MenuIcon", () => {
  it("renders without crashing", () => {
    render(<MenuIcon data-testid="menu-icon" />);
    expect(screen.getByTestId("menu-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<MenuIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<MenuIcon className="custom-class" data-testid="menu-icon" />);
    expect(screen.getByTestId("menu-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<MenuIcon onMouseEnter={onMouseEnter} data-testid="menu-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("menu-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<MenuIcon onMouseLeave={onMouseLeave} data-testid="menu-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("menu-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<MenuIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="menu-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("menu-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<MenuIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
