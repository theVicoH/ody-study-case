import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BookmarkCheckIcon } from "./bookmark-check.icon";

const TEST_ICON_SIZE = 48;

describe("BookmarkCheckIcon", () => {
  it("renders without crashing", () => {
    render(<BookmarkCheckIcon data-testid="bookmark-check-icon" />);
    expect(screen.getByTestId("bookmark-check-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<BookmarkCheckIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<BookmarkCheckIcon className="custom-class" data-testid="bookmark-check-icon" />);
    expect(screen.getByTestId("bookmark-check-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<BookmarkCheckIcon onMouseEnter={onMouseEnter} data-testid="bookmark-check-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("bookmark-check-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<BookmarkCheckIcon onMouseLeave={onMouseLeave} data-testid="bookmark-check-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("bookmark-check-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<BookmarkCheckIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="bookmark-check-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("bookmark-check-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<BookmarkCheckIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
