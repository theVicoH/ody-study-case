import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EyeIcon } from "./eye.icon";

const TEST_ICON_SIZE = 48;

describe("EyeIcon", () => {
  it("renders without crashing", () => {
    render(<EyeIcon data-testid="eye-icon" />);
    expect(screen.getByTestId("eye-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<EyeIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<EyeIcon className="custom-class" data-testid="eye-icon" />);
    expect(screen.getByTestId("eye-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<EyeIcon onMouseEnter={onMouseEnter} data-testid="eye-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("eye-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<EyeIcon onMouseLeave={onMouseLeave} data-testid="eye-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("eye-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<EyeIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="eye-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("eye-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<EyeIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
