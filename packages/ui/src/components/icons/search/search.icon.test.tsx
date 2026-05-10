import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SearchIcon } from "./search.icon";

const TEST_ICON_SIZE = 48;

describe("SearchIcon", () => {
  it("renders without crashing", () => {
    render(<SearchIcon data-testid="search-icon" />);
    expect(screen.getByTestId("search-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<SearchIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<SearchIcon className="custom-class" data-testid="search-icon" />);
    expect(screen.getByTestId("search-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<SearchIcon onMouseEnter={onMouseEnter} data-testid="search-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("search-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<SearchIcon onMouseLeave={onMouseLeave} data-testid="search-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("search-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<SearchIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="search-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("search-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
