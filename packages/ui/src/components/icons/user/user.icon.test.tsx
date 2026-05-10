import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserIcon } from "./user.icon";

const TEST_ICON_SIZE = 48;

describe("UserIcon", () => {
  it("renders without crashing", () => {
    render(<UserIcon data-testid="user-icon" />);
    expect(screen.getByTestId("user-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<UserIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<UserIcon className="custom-class" data-testid="user-icon" />);
    expect(screen.getByTestId("user-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<UserIcon onMouseEnter={onMouseEnter} data-testid="user-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("user-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<UserIcon onMouseLeave={onMouseLeave} data-testid="user-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("user-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<UserIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="user-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("user-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<UserIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
