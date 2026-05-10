import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { XIcon } from "./x.icon";

const TEST_ICON_SIZE = 48;

describe("XIcon", () => {
  it("renders without crashing", () => {
    render(<XIcon data-testid="x-icon" />);
    expect(screen.getByTestId("x-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<XIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<XIcon className="custom-class" data-testid="x-icon" />);
    expect(screen.getByTestId("x-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<XIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="x-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("x-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<XIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
