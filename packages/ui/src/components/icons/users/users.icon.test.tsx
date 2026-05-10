import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UsersIcon } from "./users.icon";

const TEST_ICON_SIZE = 48;

describe("UsersIcon", () => {
  it("renders without crashing", () => {
    render(<UsersIcon data-testid="users-icon" />);
    expect(screen.getByTestId("users-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<UsersIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<UsersIcon className="custom-class" data-testid="users-icon" />);
    expect(screen.getByTestId("users-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<UsersIcon onMouseEnter={onMouseEnter} data-testid="users-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("users-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<UsersIcon onMouseLeave={onMouseLeave} data-testid="users-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("users-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<UsersIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="users-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("users-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<UsersIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
